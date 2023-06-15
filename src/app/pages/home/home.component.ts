/**
 * Title: home.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component for the main part of the application.
*/

import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { HoursService } from '../../shared/services/hours.service';
import { Hours } from '../../shared/models/hours';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  serverMessages: Message[] = [];
  hubId: string;
  payRate: number = 0;
  hours: Hours = {} as Hours
  timeFormat: string = '^([01]?[0-9]|2[0-3]):[0-5][0-9]$';

  hoursForm: FormGroup = this.fb.group({

    payRate: [null, Validators.compose([
      Validators.required, Validators.pattern('^([0-9]{1,3}).[0-9]{2}$') ])],

    // Previous Week Actual Hours
    previousSundayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousSundayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousMondayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousMondayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousTuesdayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousTuesdayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousWednesdayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousWednesdayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousThursdayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousThursdayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousFridayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousFridayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousSaturdayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    previousSaturdayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],

    // Current Week Actual Hours
    currentSundayClockIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentSundayClockOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentMondayClockIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentMondayClockOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentTuesdayClockIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentTuesdayClockOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentWednesdayClockIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentWednesdayClockOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentThursdayClockIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentThursdayClockOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentFridayClockIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentFridayClockOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentSaturdayClockIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentSaturdayClockOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],

    // Current Week Schedule
    currentSundayScheduleIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentSundayScheduleOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentMondayScheduleIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentMondayScheduleOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentTuesdayScheduleIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentTuesdayScheduleOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentWednesdayScheduleIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentWednesdayScheduleOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentThursdayScheduleIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentThursdayScheduleOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentFridayScheduleIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentFridayScheduleOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentSaturdayScheduleIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    currentSaturdayScheduleOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],

    // Next Week Schedule
    nextSundayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextSundayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextMondayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextMondayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextTuesdayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextTuesdayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextWednesdayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextWednesdayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextThursdayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextThursdayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextFridayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextFridayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextSaturdayIn:  [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
    nextSaturdayOut: [null, Validators.compose([
      Validators.required, Validators.pattern(this.timeFormat) ])],
  })

  // Previous week hours
  previousSundayHours: number = 0;
  previousMondayHours: number = 0;
  previousTuesdayHours: number = 0;
  previousWednesdayHours: number = 0;
  previousThursdayHours: number = 0;
  previousFridayHours: number = 0;
  previousSaturdayHours: number = 0;

  previousPaycheck: number = 0;

  // Current week actual hours
  currentSundayActualHours: number = 0;
  currentSundayDOT: number = 0;
  currentMondayActualHours: number = 0;
  currentMondayDOT: number = 0;
  currentTuesdayActualHours: number = 0;
  currentTuesdayDOT: number = 0;
  currentWednesdayActualHours: number = 0;
  currentWednesdayDOT: number = 0;
  currentThursdayActualHours: number = 0;
  currentThursdayDOT: number = 0;
  currentFridayActualHours: number = 0;
  currentFridayDOT: number = 0;
  currentSaturdayActualHours: number = 0;
  currentSaturdayDOT: number = 0;

  currentPaycheck: number = 0;

  // Current week schedule
  currentSundayScheduledHours: number = 0;
  currentSundayProjection: number = 0;
  currentMondayScheduledHours: number = 0;
  currentMondayProjection: number = 0;
  currentTuesdayScheduledHours: number = 0;
  currentTuesdayProjection: number = 0;
  currentWednesdayScheduledHours: number = 0;
  currentWednesdayProjection: number = 0;
  currentThursdayScheduledHours: number = 0;
  currentThursdayProjection: number = 0;
  currentFridayScheduledHours: number = 0;
  currentFridayProjection: number = 0;
  currentSaturdayScheduledHours: number = 0;
  currentSaturdayProjection: number = 0;

  // Next week
  nextSundayHours: number = 0;
  nextSundayProjection: number = 0;
  nextMondayHours: number = 0;
  nextMondayProjection: number = 0;
  nextTuesdayHours: number = 0;
  nextTuesdayProjection: number = 0;
  nextWednesdayHours: number = 0;
  nextWednesdayProjection: number = 0;
  nextThursdayHours: number = 0;
  nextThursdayProjection: number = 0;
  nextFridayHours: number = 0;
  nextFridayProjection: number = 0;
  nextSaturdayHours: number = 0;
  nextSaturdayProjection: number = 0;

  constructor(
    private cookieService: CookieService,
    private fb: FormBuilder,
    private hoursService: HoursService,
    private dialog: MatDialog
  ) {
    this.hubId = this.cookieService.get('hubId') ?? '';

    this.hoursService.findHoursByHubId(this.hubId).subscribe({
      next: (res) => {
        this.hours = res.data;
      },
      error: (e) => {
        console.log(e);
      },

      // Adds the found hours to the form
      complete: () => {

        console.log(this.hours);

        this.payRate = this.hours.payRate

        this.hoursForm.controls['payRate'].setValue(this.hours.payRate);

        // Previous Week In
        this.hoursForm.controls['previousSundayIn'].setValue(
          this.hours.previousWeekIn.sunday);
        this.hoursForm.controls['previousMondayIn'].setValue(
          this.hours.previousWeekIn.monday);
        this.hoursForm.controls['previousTuesdayIn'].setValue(
          this.hours.previousWeekIn.tuesday);
        this.hoursForm.controls['previousWednesdayIn'].setValue(
          this.hours.previousWeekIn.wednesday);
        this.hoursForm.controls['previousThursdayIn'].setValue(
          this.hours.previousWeekIn.thursday);
        this.hoursForm.controls['previousFridayIn'].setValue(
          this.hours.previousWeekIn.friday);
        this.hoursForm.controls['previousSaturdayIn'].setValue(
          this.hours.previousWeekIn.saturday);

        // Previous Week Out
        this.hoursForm.controls['previousSundayOut'].setValue(this.hours.previousWeekOut.sunday);
        this.hoursForm.controls['previousMondayOut'].setValue(this.hours.previousWeekOut.monday);
        this.hoursForm.controls['previousTuesdayOut'].setValue(this.hours.previousWeekOut.tuesday);
        this.hoursForm.controls['previousWednesdayOut'].setValue(this.hours.previousWeekOut.wednesday);
        this.hoursForm.controls['previousThursdayOut'].setValue(this.hours.previousWeekOut.thursday);
        this.hoursForm.controls['previousFridayOut'].setValue(this.hours.previousWeekOut.friday);
        this.hoursForm.controls['previousSaturdayOut'].setValue(this.hours.previousWeekOut.saturday);

        // Current Week Actual Hours In
        this.hoursForm.controls['currentSundayClockIn'].setValue(this.hours.currentWeekClockIn.sunday);
        this.hoursForm.controls['currentMondayClockIn'].setValue(this.hours.currentWeekClockIn.monday);
        this.hoursForm.controls['currentTuesdayClockIn'].setValue(this.hours.currentWeekClockIn.tuesday);
        this.hoursForm.controls['currentWednesdayClockIn'].setValue(this.hours.currentWeekClockIn.wednesday);
        this.hoursForm.controls['currentThursdayClockIn'].setValue(this.hours.currentWeekClockIn.thursday);
        this.hoursForm.controls['currentFridayClockIn'].setValue(this.hours.currentWeekClockIn.friday);
        this.hoursForm.controls['currentSaturdayClockIn'].setValue(this.hours.currentWeekClockIn.saturday);

        // Current Week Actual Hours Out
        this.hoursForm.controls['currentSundayClockOut'].setValue(this.hours.currentWeekClockOut.sunday);
        this.hoursForm.controls['currentMondayClockOut'].setValue(this.hours.currentWeekClockOut.monday);
        this.hoursForm.controls['currentTuesdayClockOut'].setValue(this.hours.currentWeekClockOut.tuesday);
        this.hoursForm.controls['currentWednesdayClockOut'].setValue(this.hours.currentWeekClockOut.wednesday);
        this.hoursForm.controls['currentThursdayClockOut'].setValue(this.hours.currentWeekClockOut.thursday);
        this.hoursForm.controls['currentFridayClockOut'].setValue(this.hours.currentWeekClockOut.friday);
        this.hoursForm.controls['currentSaturdayClockOut'].setValue(this.hours.currentWeekClockOut.saturday);

        // Current Week Scheduled Hours In
        this.hoursForm.controls['currentSundayScheduleIn'].setValue(this.hours.currentWeekScheduleIn.sunday);
        this.hoursForm.controls['currentMondayScheduleIn'].setValue(this.hours.currentWeekScheduleIn.monday);
        this.hoursForm.controls['currentTuesdayScheduleIn'].setValue(this.hours.currentWeekScheduleIn.tuesday);
        this.hoursForm.controls['currentWednesdayScheduleIn'].setValue(this.hours.currentWeekScheduleIn.wednesday);
        this.hoursForm.controls['currentThursdayScheduleIn'].setValue(this.hours.currentWeekScheduleIn.thursday);
        this.hoursForm.controls['currentFridayScheduleIn'].setValue(this.hours.currentWeekScheduleIn.friday);
        this.hoursForm.controls['currentSaturdayScheduleIn'].setValue(this.hours.currentWeekScheduleIn.saturday);

        // Current Week Scheduled Hours Out
        this.hoursForm.controls['currentSundayScheduleOut'].setValue(this.hours.currentWeekScheduleOut.sunday);
        this.hoursForm.controls['currentMondayScheduleOut'].setValue(this.hours.currentWeekScheduleOut.monday);
        this.hoursForm.controls['currentTuesdayScheduleOut'].setValue(this.hours.currentWeekScheduleOut.tuesday);
        this.hoursForm.controls['currentWednesdayScheduleOut'].setValue(this.hours.currentWeekScheduleOut.wednesday);
        this.hoursForm.controls['currentThursdayScheduleOut'].setValue(this.hours.currentWeekScheduleOut.thursday);
        this.hoursForm.controls['currentFridayScheduleOut'].setValue(this.hours.currentWeekScheduleOut.friday);
        this.hoursForm.controls['currentSaturdayScheduleOut'].setValue(this.hours.currentWeekScheduleOut.saturday);

        // Next Week Scheduled Hours In
        this.hoursForm.controls['nextSundayIn'].setValue(this.hours.nextWeekIn.sunday);
        this.hoursForm.controls['nextMondayIn'].setValue(this.hours.nextWeekIn.monday);
        this.hoursForm.controls['nextTuesdayIn'].setValue(this.hours.nextWeekIn.tuesday);
        this.hoursForm.controls['nextWednesdayIn'].setValue(this.hours.nextWeekIn.wednesday);
        this.hoursForm.controls['nextThursdayIn'].setValue(this.hours.nextWeekIn.thursday);
        this.hoursForm.controls['nextFridayIn'].setValue(this.hours.nextWeekIn.friday);
        this.hoursForm.controls['nextSaturdayIn'].setValue(this.hours.nextWeekIn.saturday);

        // Next Week Scheduled Hours Out
        this.hoursForm.controls['nextSundayOut'].setValue(this.hours.nextWeekOut.sunday);
        this.hoursForm.controls['nextMondayOut'].setValue(this.hours.nextWeekOut.monday);
        this.hoursForm.controls['nextTuesdayOut'].setValue(this.hours.nextWeekOut.tuesday);
        this.hoursForm.controls['nextWednesdayOut'].setValue(this.hours.nextWeekOut.wednesday);
        this.hoursForm.controls['nextThursdayOut'].setValue(this.hours.nextWeekOut.thursday);
        this.hoursForm.controls['nextFridayOut'].setValue(this.hours.nextWeekOut.friday);
        this.hoursForm.controls['nextSaturdayOut'].setValue(this.hours.nextWeekOut.saturday);

        // Previous week clock in values
        let previousSundayIn = this.timeConversion(this.hoursForm.controls['previousSundayIn'].value);
        let previousMondayIn = this.timeConversion(this.hoursForm.controls['previousMondayIn'].value);
        let previousTuesdayIn = this.timeConversion(this.hoursForm.controls['previousTuesdayIn'].value);
        let previousWednesdayIn = this.timeConversion(this.hoursForm.controls['previousWednesdayIn'].value);
        let previousThursdayIn = this.timeConversion(this.hoursForm.controls['previousThursdayIn'].value);
        let previousFridayIn = this.timeConversion(this.hoursForm.controls['previousFridayIn'].value);
        let previousSaturdayIn = this.timeConversion(this.hoursForm.controls['previousSaturdayIn'].value);

        // Previous week clock out values
        let previousSundayOut = this.timeConversion(this.hoursForm.controls['previousSundayOut'].value);
        let previousMondayOut = this.timeConversion(this.hoursForm.controls['previousMondayOut'].value);
        let previousTuesdayOut = this.timeConversion(this.hoursForm.controls['previousTuesdayOut'].value);
        let previousWednesdayOut = this.timeConversion(this.hoursForm.controls['previousWednesdayOut'].value);
        let previousThursdayOut = this.timeConversion(this.hoursForm.controls['previousThursdayOut'].value);
        let previousFridayOut = this.timeConversion(this.hoursForm.controls['previousFridayOut'].value);
        let previousSaturdayOut = this.timeConversion(this.hoursForm.controls['previousSaturdayOut'].value);

        // Previous Week daily hours
        this.previousSundayHours = this.dailyHours(previousSundayIn, previousSundayOut);
        this.previousMondayHours = this.dailyHours(previousMondayIn, previousMondayOut);
        this.previousTuesdayHours = this.dailyHours(previousTuesdayIn, previousTuesdayOut);
        this.previousWednesdayHours = this.dailyHours(previousWednesdayIn, previousWednesdayOut);
        this.previousThursdayHours = this.dailyHours(previousThursdayIn, previousThursdayOut);
        this.previousFridayHours = this.dailyHours(previousFridayIn, previousFridayOut);
        this.previousSaturdayHours = this.dailyHours(previousSaturdayIn, previousSaturdayOut);

        // Previous week pay check
        this.previousPaycheck = this.calculatePay(
          this.previousSundayHours,
          this.previousMondayHours,
          this.previousTuesdayHours,
          this.previousWednesdayHours,
          this.previousThursdayHours,
          this.previousFridayHours,
          this.previousSaturdayHours,
          this.payRate);

          // Current week clock in values
        let currentSundayClockIn = this.timeConversion(this.hoursForm.controls['currentSundayClockIn'].value);
        let currentMondayClockIn = this.timeConversion(this.hoursForm.controls['currentMondayClockIn'].value);
        let currentTuesdayClockIn = this.timeConversion(this.hoursForm.controls['currentTuesdayClockIn'].value);
        let currentWednesdayClockIn = this.timeConversion(this.hoursForm.controls['currentWednesdayClockIn'].value);
        let currentThursdayClockIn = this.timeConversion(this.hoursForm.controls['currentThursdayClockIn'].value);
        let currentFridayClockIn = this.timeConversion(this.hoursForm.controls['currentFridayClockIn'].value);
        let currentSaturdayClockIn = this.timeConversion(this.hoursForm.controls['currentSaturdayClockIn'].value);

        // Current week clock out values
        let currentSundayClockOut = this.timeConversion(this.hoursForm.controls['currentSundayClockOut'].value);
        let currentMondayClockOut = this.timeConversion(this.hoursForm.controls['currentMondayClockOut'].value);
        let currentTuesdayClockOut = this.timeConversion(this.hoursForm.controls['currentTuesdayClockOut'].value);
        let currentWednesdayClockOut = this.timeConversion(this.hoursForm.controls['currentWednesdayClockOut'].value);
        let currentThursdayClockOut = this.timeConversion(this.hoursForm.controls['currentThursdayClockOut'].value);
        let currentFridayClockOut = this.timeConversion(this.hoursForm.controls['currentFridayClockOut'].value);
        let currentSaturdayClockOut = this.timeConversion(this.hoursForm.controls['currentSaturdayClockOut'].value);

        // Current week daily hours
        this.currentSundayActualHours = this.dailyHours(currentSundayClockIn, currentSundayClockOut);
        this.currentMondayActualHours = this.dailyHours(currentMondayClockIn, currentMondayClockOut);
        this.currentTuesdayActualHours = this.dailyHours(currentTuesdayClockIn, currentTuesdayClockOut);
        this.currentWednesdayActualHours = this.dailyHours(currentWednesdayClockIn, currentWednesdayClockOut);
        this.currentThursdayActualHours = this.dailyHours(currentThursdayClockIn, currentThursdayClockOut);
        this.currentFridayActualHours = this.dailyHours(currentFridayClockIn, currentFridayClockOut);
        this.currentSaturdayActualHours = this.dailyHours(currentSaturdayClockIn, currentSaturdayClockOut);

        // Current week paycheck
        this.currentPaycheck = this.calculatePay(
          this.currentSundayActualHours,
          this.currentMondayActualHours,
          this.currentTuesdayActualHours,
          this.currentWednesdayActualHours,
          this.currentThursdayActualHours,
          this.currentFridayActualHours,
          this.currentSaturdayActualHours,
          this.payRate);

        // Current week Actual DOT Hour Totals
        this.currentSundayDOT = this.calculateDOT(
          this.previousSundayHours,
          this.previousMondayHours,
          this.previousTuesdayHours,
          this.previousWednesdayHours,
          this.previousThursdayHours,
          this.previousFridayHours,
          this.previousSaturdayHours,
          this.currentSundayActualHours);

        this.currentMondayDOT = this.calculateMoreDOT(
          this.currentSundayDOT,
          this.previousSundayHours,
          this.currentMondayActualHours);

        this.currentTuesdayDOT = this.calculateMoreDOT(
          this.currentMondayDOT,
          this.previousMondayHours,
          this.currentTuesdayActualHours);

        this.currentWednesdayDOT = this.calculateMoreDOT(
          this.currentTuesdayDOT,
          this.previousTuesdayHours,
          this.currentWednesdayActualHours);

        this.currentThursdayDOT = this.calculateMoreDOT(
          this.currentWednesdayDOT,
          this.previousWednesdayHours,
          this.currentThursdayActualHours);

        this.currentFridayDOT = this.calculateMoreDOT(
          this.currentThursdayDOT,
          this.previousThursdayHours,
          this.currentFridayActualHours);

        this.currentSaturdayDOT = this.calculateMoreDOT(
          this.currentFridayDOT,
          this.previousFridayHours,
          this.currentSaturdayActualHours);

        // Current week scheduled in values
        let currentSundayScheduleIn = this.timeConversion(this.hoursForm.controls['currentSundayScheduleIn'].value);
        let currentMondayScheduleIn = this.timeConversion(this.hoursForm.controls['currentMondayScheduleIn'].value);
        let currentTuesdayScheduleIn = this.timeConversion(this.hoursForm.controls['currentTuesdayScheduleIn'].value);
        let currentWednesdayScheduleIn = this.timeConversion(this.hoursForm.controls['currentWednesdayScheduleIn'].value);
        let currentThursdayScheduleIn = this.timeConversion(this.hoursForm.controls['currentThursdayScheduleIn'].value);
        let currentFridayScheduleIn = this.timeConversion(this.hoursForm.controls['currentFridayScheduleIn'].value);
        let currentSaturdayScheduleIn = this.timeConversion(this.hoursForm.controls['currentSaturdayScheduleIn'].value);

        // Current week scheduled out values
        let currentSundayScheduleOut = this.timeConversion(this.hoursForm.controls['currentSundayScheduleOut'].value);
        let currentMondayScheduleOut = this.timeConversion(this.hoursForm.controls['currentMondayScheduleOut'].value);
        let currentTuesdayScheduleOut = this.timeConversion(this.hoursForm.controls['currentTuesdayScheduleOut'].value);
        let currentWednesdayScheduleOut = this.timeConversion(this.hoursForm.controls['currentWednesdayScheduleOut'].value);
        let currentThursdayScheduleOut = this.timeConversion(this.hoursForm.controls['currentThursdayScheduleOut'].value);
        let currentFridayScheduleOut = this.timeConversion(this.hoursForm.controls['currentFridayScheduleOut'].value);
        let currentSaturdayScheduleOut = this.timeConversion(this.hoursForm.controls['currentSaturdayScheduleOut'].value);

        // Current week scheduled hours
        this.currentSundayScheduledHours = this.dailyHours(currentSundayScheduleIn, currentSundayScheduleOut);
        this.currentMondayScheduledHours = this.dailyHours(currentMondayScheduleIn, currentMondayScheduleOut);
        this.currentTuesdayScheduledHours = this.dailyHours(currentTuesdayScheduleIn, currentTuesdayScheduleOut);
        this.currentWednesdayScheduledHours = this.dailyHours(currentWednesdayScheduleIn, currentWednesdayScheduleOut);
        this.currentThursdayScheduledHours = this.dailyHours(currentThursdayScheduleIn, currentThursdayScheduleOut);
        this.currentFridayScheduledHours = this.dailyHours(currentFridayScheduleIn, currentFridayScheduleOut);
        this.currentSaturdayScheduledHours = this.dailyHours(currentSaturdayScheduleIn, currentSaturdayScheduleOut);

        // Current week Scheduled DOT Hour Totals
        this.currentSundayProjection = this.calculateMoreDOT(
          this.currentSundayDOT,
          this.currentSundayActualHours,
          this.currentSundayScheduledHours);

        this.currentMondayProjection = this.calculateMoreDOT(
          this.currentMondayDOT,
          this.currentMondayActualHours,
          this.currentMondayScheduledHours);

        this.currentTuesdayProjection = this.calculateMoreDOT(
          this.currentTuesdayDOT,
          this.currentTuesdayActualHours,
          this.currentTuesdayScheduledHours);

        this.currentWednesdayProjection = this.calculateMoreDOT(
          this.currentWednesdayDOT,
          this.currentWednesdayActualHours,
          this.currentWednesdayScheduledHours);

        this.currentThursdayProjection = this.calculateMoreDOT(
          this.currentThursdayDOT,
          this.currentThursdayActualHours,
          this.currentThursdayScheduledHours);

        this.currentFridayProjection = this.calculateMoreDOT(
          this.currentFridayDOT,
          this.currentFridayActualHours,
          this.currentFridayScheduledHours);

        this.currentSaturdayProjection = this.calculateMoreDOT(
          this.currentSaturdayDOT,
          this.currentSaturdayActualHours,
          this.currentSaturdayScheduledHours);

        // Next week scheduled hours values
        let nextSundayIn = this.timeConversion(this.hoursForm.controls['nextSundayIn'].value);
        let nextMondayIn = this.timeConversion(this.hoursForm.controls['nextMondayIn'].value);
        let nextTuesdayIn = this.timeConversion(this.hoursForm.controls['nextTuesdayIn'].value);
        let nextWednesdayIn = this.timeConversion(this.hoursForm.controls['nextWednesdayIn'].value);
        let nextThursdayIn = this.timeConversion(this.hoursForm.controls['nextThursdayIn'].value);
        let nextFridayIn = this.timeConversion(this.hoursForm.controls['nextFridayIn'].value);
        let nextSaturdayIn = this.timeConversion(this.hoursForm.controls['nextSaturdayIn'].value);

        // Next Week Scheduled Hours Out
        let nextSundayOut = this.timeConversion(this.hoursForm.controls['nextSundayOut'].value);
        let nextMondayOut = this.timeConversion(this.hoursForm.controls['nextMondayOut'].value);
        let nextTuesdayOut = this.timeConversion(this.hoursForm.controls['nextTuesdayOut'].value);
        let nextWednesdayOut = this.timeConversion(this.hoursForm.controls['nextWednesdayOut'].value);
        let nextThursdayOut = this.timeConversion(this.hoursForm.controls['nextThursdayOut'].value);
        let nextFridayOut = this.timeConversion(this.hoursForm.controls['nextFridayOut'].value);
        let nextSaturdayOut = this.timeConversion(this.hoursForm.controls['nextSaturdayOut'].value);

        // Next week scheduled hours
        this.nextSundayHours = this.dailyHours(nextSundayIn, nextSundayOut);
        this.nextMondayHours = this.dailyHours(nextMondayIn, nextMondayOut);
        this.nextTuesdayHours = this.dailyHours(nextTuesdayIn, nextTuesdayOut);
        this.nextWednesdayHours = this.dailyHours(nextWednesdayIn, nextWednesdayOut);
        this.nextThursdayHours = this.dailyHours(nextThursdayIn, nextThursdayOut);
        this.nextFridayHours = this.dailyHours(nextFridayIn, nextFridayOut);
        this.nextSaturdayHours = this.dailyHours(nextSaturdayIn, nextSaturdayOut);

        // Next week Scheduled DOT Hour Projections
        this.nextSundayProjection = this.calculateMoreDOT(
          this.currentSundayDOT,
          this.previousSundayHours,
          this.nextSundayHours);

        this.nextMondayProjection = this.calculateMoreDOT(
          this.currentMondayDOT,
          this.previousMondayHours,
          this.nextMondayHours);

        this.nextTuesdayProjection = this.calculateMoreDOT(
          this.currentTuesdayDOT,
          this.previousTuesdayHours,
          this.nextTuesdayHours);

        this.nextWednesdayProjection = this.calculateMoreDOT(
          this.currentWednesdayDOT,
          this.previousWednesdayHours,
          this.nextWednesdayHours);

        this.nextThursdayProjection = this.calculateMoreDOT(
          this.currentThursdayDOT,
          this.previousThursdayHours,
          this.nextThursdayHours);

        this.nextFridayProjection = this.calculateMoreDOT(
          this.currentFridayDOT,
          this.previousFridayHours,
          this.nextFridayHours);

        this.nextSaturdayProjection = this.calculateMoreDOT(
          this.currentSaturdayDOT,
          this.previousSaturdayHours,
          this.nextSaturdayHours);
      }
    })
  }

  saveHours(): void {
    const updatedForm = this.hoursForm.value;
    const newHours = {
      hubId: this.hubId,
      payRate: parseFloat(updatedForm.payRate),
      previousWeekIn: {
        sunday: updatedForm.previousSundayIn,
        monday: updatedForm.previousMondayIn,
        tuesday: updatedForm.previousTuesdayIn,
        wednesday: updatedForm.previousWednesdayIn,
        thursday: updatedForm.previousThursdayIn,
        friday: updatedForm.previousFridayIn,
        saturday: updatedForm.previousSaturdayIn,
      },
      previousWeekOut: {
        sunday: updatedForm.previousSundayOut,
        monday: updatedForm.previousMondayOut,
        tuesday: updatedForm.previousTuesdayOut,
        wednesday: updatedForm.previousWednesdayOut,
        thursday: updatedForm.previousThursdayOut,
        friday: updatedForm.previousFridayOut,
        saturday: updatedForm.previousSaturdayOut,
      },
      currentWeekClockIn: {
        sunday: updatedForm.currentSundayClockIn,
        monday: updatedForm.currentMondayClockIn,
        tuesday: updatedForm.currentTuesdayClockIn,
        wednesday: updatedForm.currentWednesdayClockIn,
        thursday: updatedForm.currentThursdayClockIn,
        friday: updatedForm.currentFridayClockIn,
        saturday: updatedForm.currentSaturdayClockIn,
      },
      currentWeekClockOut: {
        sunday: updatedForm.currentSundayClockOut,
        monday: updatedForm.currentMondayClockOut,
        tuesday: updatedForm.currentTuesdayClockOut,
        wednesday: updatedForm.currentWednesdayClockOut,
        thursday: updatedForm.currentThursdayClockOut,
        friday: updatedForm.currentFridayClockOut,
        saturday: updatedForm.currentSaturdayClockOut,
      },
      currentWeekScheduleIn: {
        sunday: updatedForm.currentSundayScheduleIn,
        monday: updatedForm.currentMondayScheduleIn,
        tuesday: updatedForm.currentTuesdayScheduleIn,
        wednesday: updatedForm.currentWednesdayScheduleIn,
        thursday: updatedForm.currentThursdayScheduleIn,
        friday: updatedForm.currentFridayScheduleIn,
        saturday: updatedForm.currentSaturdayScheduleIn,
      },
      currentWeekScheduleOut: {
        sunday: updatedForm.currentSundayScheduleOut,
        monday: updatedForm.currentMondayScheduleOut,
        tuesday: updatedForm.currentTuesdayScheduleOut,
        wednesday: updatedForm.currentWednesdayScheduleOut,
        thursday: updatedForm.currentThursdayScheduleOut,
        friday: updatedForm.currentFridayScheduleOut,
        saturday: updatedForm.currentSaturdayScheduleOut,
      },
      nextWeekIn: {
        sunday: updatedForm.nextSundayIn,
        monday: updatedForm.nextMondayIn,
        tuesday: updatedForm.nextTuesdayIn,
        wednesday: updatedForm.nextWednesdayIn,
        thursday: updatedForm.nextThursdayIn,
        friday: updatedForm.nextFridayIn,
        saturday: updatedForm.nextSaturdayIn,
      },
      nextWeekOut: {
        sunday: updatedForm.nextSundayOut,
        monday: updatedForm.nextMondayOut,
        tuesday: updatedForm.nextTuesdayOut,
        wednesday: updatedForm.nextWednesdayOut,
        thursday: updatedForm.nextThursdayOut,
        friday: updatedForm.nextFridayOut,
        saturday: updatedForm.nextSaturdayOut,
      },
    }

    this.hoursService.updateHours(this.hubId, newHours).subscribe({
      next: (res) => {
        this.serverMessages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Hours Successfully Updated. Please wait while we refresh your data.'
          }
        ];
        window.scroll(0,0);
        setTimeout(() => {
          location.reload()
        }, 500);
      },
      error: (e) => {
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: e.message
          }
        ];
        console.log(e);
        window.scroll(0,0);
      }
    })

  }

  shiftHours(): void {

    // Confirmation Dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Would you like to start a new week?',
        body: "Are you sure you want to shift the current week's hours to the previous week and next week's schedule to this week's schedule?"
      },
      disableClose: true
    })

    // If confirmed
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result === 'confirm') {

          const updatedForm = this.hoursForm.value;

          const zeroHours = {
            sunday: "00:00",
            monday: "00:00",
            tuesday: "00:00",
            wednesday: "00:00",
            thursday: "00:00",
            friday: "00:00",
            saturday: "00:00",
          }

          const newHours = {
            hubId: this.hubId,
            payRate: parseFloat(updatedForm.payRate),
            previousWeekIn: {
              sunday: updatedForm.currentSundayClockIn,
              monday: updatedForm.currentMondayClockIn,
              tuesday: updatedForm.currentTuesdayClockIn,
              wednesday: updatedForm.currentWednesdayClockIn,
              thursday: updatedForm.currentThursdayClockIn,
              friday: updatedForm.currentFridayClockIn,
              saturday: updatedForm.currentSaturdayClockIn,
            },
            previousWeekOut: {
              sunday: updatedForm.currentSundayClockOut,
              monday: updatedForm.currentMondayClockOut,
              tuesday: updatedForm.currentTuesdayClockOut,
              wednesday: updatedForm.currentWednesdayClockOut,
              thursday: updatedForm.currentThursdayClockOut,
              friday: updatedForm.currentFridayClockOut,
              saturday: updatedForm.currentSaturdayClockOut,
            },
            currentWeekClockIn: zeroHours,
            currentWeekClockOut: zeroHours,
            currentWeekScheduleIn: {
              sunday: updatedForm.nextSundayIn,
              monday: updatedForm.nextMondayIn,
              tuesday: updatedForm.nextTuesdayIn,
              wednesday: updatedForm.nextWednesdayIn,
              thursday: updatedForm.nextThursdayIn,
              friday: updatedForm.nextFridayIn,
              saturday: updatedForm.nextSaturdayIn,
            },
            currentWeekScheduleOut: {
              sunday: updatedForm.nextSundayOut,
              monday: updatedForm.nextMondayOut,
              tuesday: updatedForm.nextTuesdayOut,
              wednesday: updatedForm.nextWednesdayOut,
              thursday: updatedForm.nextThursdayOut,
              friday: updatedForm.nextFridayOut,
              saturday: updatedForm.nextSaturdayOut,
            },
            nextWeekIn: zeroHours,
            nextWeekOut: zeroHours,
          }

          this.hoursService.updateHours(this.hubId, newHours).subscribe({
            next: (res) => {
              this.serverMessages = [
                {
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Hours Successfully Updated. Please wait why we refresh your data.'
                }
              ];
              window.scroll(0,0);
              setTimeout(() => {
                location.reload()
              }, 500);
            },
            error: (e) => {
              this.serverMessages = [
                {
                  severity: 'error',
                  summary: 'Error',
                  detail: e.message
                }
              ];
              console.log(e);
              window.scroll(0,0);
            }
          })
          return
        }

        // If Cancelled
        this.serverMessages = [
          {
            severity: 'info',
            summary: 'Info',
            detail: 'Action Canceled'
          }
        ]
        window.scroll(0,0);
      }
    })
  }

  timeConversion(time: string) {
    let timeInput = time.split(':');
    let hours = parseFloat(timeInput[0]);
    let minutes = timeInput[1] ? parseFloat(timeInput[1]) : 0;
    return (hours + minutes / 60).toFixed(2);
  }

  dailyHours(timeIn: any, timeOut: any) {
    timeIn = parseFloat(timeIn);
    timeOut = parseFloat(timeOut);
    if (timeOut < timeIn) {
      timeOut += 24;
    }
    let totalHours = timeOut - timeIn;
    if (totalHours > 7.24) {
      totalHours -= .5;
    }
    return totalHours;
  }

  calculatePay(
    sun: number,
    mon: number,
    tues: number,
    weds: number,
    thurs: number,
    fri: number,
    sat: number,
    payRate: number
  ) {
    let standardHours = 0;
    let overtimeHours = 0;
    if (sun > 8) {
      standardHours += 8;
      overtimeHours += sun - 8;
    } else {
      standardHours += sun;
    }
    if (mon > 8) {
      standardHours += 8;
      overtimeHours += mon - 8;
    } else {
      standardHours += mon;
    }
    if (tues > 8) {
      standardHours += 8;
      overtimeHours += tues - 8;
    } else {
      standardHours += tues;
    }
    if (weds > 8) {
      standardHours += 8;
      overtimeHours += weds - 8;
    } else {
      standardHours += weds;
    }
    if (thurs > 8) {
      standardHours += 8;
      overtimeHours += thurs - 8;
    } else {
      standardHours += thurs;
    }
    if (fri > 8) {
      standardHours += 8;
      overtimeHours += fri - 8;
    } else {
      standardHours += fri;
    }
    if (sat > 8) {
      standardHours += 8;
      overtimeHours += sat - 8;
    } else {
      standardHours += sat;
    }
    if (standardHours > 40) {
      overtimeHours += (standardHours - 40)
      standardHours = 40
    }
    let totalPay = (standardHours * payRate) + (overtimeHours * payRate * 1.5);
    return parseFloat(totalPay.toFixed(2));
  }

  calculateDOT(
    day1: number,
    day2: number,
    day3: number,
    day4: number,
    day5: number,
    day6: number,
    day7: number,
    day8: number
  ) {
    let dotHours = day1 + day2 + day3 + day4 + day5 + day6 + day7 + day8;
    return dotHours;
  }

  calculateMoreDOT(previousDOT: number, dropDay: number, addDay: number) {
    let dotHours = previousDOT - dropDay + addDay;
    return dotHours;
  }

  ngOnInit(): void {
  }

}
