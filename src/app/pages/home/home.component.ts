/**
 * Title: home.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component for the main part of the application.
*/

import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  hoursForm: FormGroup = this.fb.group({
    hubId: [null, Validators.compose([Validators.required])],
    payRate: [null, Validators.compose([Validators.required])],

    // Previous Week Actual Hours
    previousSundayIn:  [null, Validators.compose([Validators.required])],
    previousSundayOut: [null, Validators.compose([Validators.required])],
    previousMondayIn:  [null, Validators.compose([Validators.required])],
    previousMondayOut: [null, Validators.compose([Validators.required])],
    previousTuesdayIn:  [null, Validators.compose([Validators.required])],
    previousTuesdayOut: [null, Validators.compose([Validators.required])],
    previousWednesdayIn:  [null, Validators.compose([Validators.required])],
    previousWednesdayOut: [null, Validators.compose([Validators.required])],
    previousThursdayIn:  [null, Validators.compose([Validators.required])],
    previousThursdayOut: [null, Validators.compose([Validators.required])],
    previousFridayIn:  [null, Validators.compose([Validators.required])],
    previousFridayOut: [null, Validators.compose([Validators.required])],
    previousSaturdayIn:  [null, Validators.compose([Validators.required])],
    previousSaturdayOut: [null, Validators.compose([Validators.required])],

    // Current Week Actual Hours
    currentSundayClockIn:  [null, Validators.compose([Validators.required])],
    currentSundayClockOut: [null, Validators.compose([Validators.required])],
    currentMondayClockIn:  [null, Validators.compose([Validators.required])],
    currentMondayClockOut: [null, Validators.compose([Validators.required])],
    currentTuesdayClockIn:  [null, Validators.compose([Validators.required])],
    currentTuesdayClockOut: [null, Validators.compose([Validators.required])],
    currentWednesdayClockIn:  [null, Validators.compose([Validators.required])],
    currentWednesdayClockOut: [null, Validators.compose([Validators.required])],
    currentThursdayClockIn:  [null, Validators.compose([Validators.required])],
    currentThursdayClockOut: [null, Validators.compose([Validators.required])],
    currentFridayClockIn:  [null, Validators.compose([Validators.required])],
    currentFridayClockOut: [null, Validators.compose([Validators.required])],
    currentSaturdayClockIn:  [null, Validators.compose([Validators.required])],
    currentSaturdayClockOut: [null, Validators.compose([Validators.required])],

    // Current Week Schedule
    currentSundayScheduleIn:  [null, Validators.compose([Validators.required])],
    currentSundayScheduleOut: [null, Validators.compose([Validators.required])],
    currentMondayScheduleIn:  [null, Validators.compose([Validators.required])],
    currentMondayScheduleOut: [null, Validators.compose([Validators.required])],
    currentTuesdayScheduleIn:  [null, Validators.compose([Validators.required])],
    currentTuesdayScheduleOut: [null, Validators.compose([Validators.required])],
    currentWednesdayScheduleIn:  [null, Validators.compose([Validators.required])],
    currentWednesdayScheduleOut: [null, Validators.compose([Validators.required])],
    currentThursdayScheduleIn:  [null, Validators.compose([Validators.required])],
    currentThursdayScheduleOut: [null, Validators.compose([Validators.required])],
    currentFridayScheduleIn:  [null, Validators.compose([Validators.required])],
    currentFridayScheduleOut: [null, Validators.compose([Validators.required])],
    currentSaturdayScheduleIn:  [null, Validators.compose([Validators.required])],
    currentSaturdayScheduleOut: [null, Validators.compose([Validators.required])],

    // Next Week Schedule
    nextSundayIn:  [null, Validators.compose([Validators.required])],
    nextSundayOut: [null, Validators.compose([Validators.required])],
    nextMondayIn:  [null, Validators.compose([Validators.required])],
    nextMondayOut: [null, Validators.compose([Validators.required])],
    nextTuesdayIn:  [null, Validators.compose([Validators.required])],
    nextTuesdayOut: [null, Validators.compose([Validators.required])],
    nextWednesdayIn:  [null, Validators.compose([Validators.required])],
    nextWednesdayOut: [null, Validators.compose([Validators.required])],
    nextThursdayIn:  [null, Validators.compose([Validators.required])],
    nextThursdayOut: [null, Validators.compose([Validators.required])],
    nextFridayIn:  [null, Validators.compose([Validators.required])],
    nextFridayOut: [null, Validators.compose([Validators.required])],
    nextSaturdayIn:  [null, Validators.compose([Validators.required])],
    nextSaturdayOut: [null, Validators.compose([Validators.required])],
  })

  // Form variables
  formInput = this.hoursForm.value

  // Previous Week
  previousSundayIn: string = this.formInput.previousSundayIn
  previousSundayOut: string = this.formInput.previousSundayOut
  previousSundayHours: number = 0;

  previousMondayIn: string = this.formInput.previousMondayIn
  previousMondayOut: string = this.formInput.previousMondayOut
  previousMondayHours: number = 0;

  previousTuesdayIn: string = this.formInput.previousTuesdayIn
  previousTuesdayOut: string = this.formInput.previousTuesdayOut
  previousTuesdayHours: number = 0;

  previousWednesdayIn: string = this.formInput.previousWednesdayIn
  previousWednesdayOut: string = this.formInput.previousWednesdayOut
  previousWednesdayHours: number = 0;

  previousThursdayIn: string = this.formInput.previousThursdayIn
  previousThursdayOut: string = this.formInput.previousThursdayOut
  previousThursdayHours: number = 0;

  previousFridayIn: string = this.formInput.previousFridayIn
  previousFridayOut: string = this.formInput.previousFridayOut
  previousFridayHours: number = 0;

  previousSaturdayIn: string = this.formInput.previousSaturdayIn
  previousSaturdayOut: string = this.formInput.previousSaturdayOut
  previousSaturdayHours: number = 0;

  previousPaycheck: number = 0;

  // Current week actual hours
  currentSundayClockIn: string = this.formInput.currentSundayClockIn
  currentSundayClockOut: string = this.formInput.currentSundayClockOut
  currentSundayActualHours: number = 0;
  currentSundayDOT: number = 0;

  currentMondayClockIn: string = this.formInput.currentMondayClockIn
  currentMondayClockOut: string = this.formInput.currentMondayClockOut
  currentMondayActualHours: number = 0;
  currentMondayDOT: number = 0;

  currentTuesdayClockIn: string = this.formInput.currentTuesdayClockIn
  currentTuesdayClockOut: string = this.formInput.currentTuesdayClockOut
  currentTuesdayActualHours: number = 0;
  currentTuesdayDOT: number = 0;

  currentWednesdayClockIn: string = this.formInput.currentWednesdayClockIn
  currentWednesdayClockOut: string = this.formInput.currentWednesdayClockOut
  currentWednesdayActualHours: number = 0;
  currentWednesdayDOT: number = 0;

  currentThursdayClockIn: string = this.formInput.currentThursdayClockIn
  currentThursdayClockOut: string = this.formInput.currentThursdayClockOut
  currentThursdayActualHours: number = 0;
  currentThursdayDOT: number = 0;

  currentFridayClockIn: string = this.formInput.currentFridayClockIn
  currentFridayClockOut: string = this.formInput.currentFridayClockOut
  currentFridayActualHours: number = 0;
  currentFridayDOT: number = 0;

  currentSaturdayClockIn: string = this.formInput.currentSaturdayClockIn
  currentSaturdayClockOut: string = this.formInput.currentSaturdayClockOut
  currentSaturdayActualHours: number = 0;
  currentSaturdayDOT: number = 0;

  currentPaycheck: number = 0;

  // Current week schedule
  currentSundayScheduleIn: string = this.formInput.currentSundayScheduleIn
  currentSundayScheduleOut: string = this.formInput.currentSundayScheduleOut
  currentSundayScheduledHours: number = 0;
  currentSundayProjection: number = 0;

  currentMondayScheduleIn: string = this.formInput.currentMondayScheduleIn
  currentMondayScheduleOut: string = this.formInput.currentMondayScheduleOut
  currentMondayScheduledHours: number = 0;
  currentMondayProjection: number = 0;

  currentTuesdayScheduleIn: string = this.formInput.currentTuesdayScheduleIn
  currentTuesdayScheduleOut: string = this.formInput.currentTuesdayScheduleOut
  currentTuesdayScheduledHours: number = 0;
  currentTuesdayProjection: number = 0;

  currentWednesdayScheduleIn: string = this.formInput.currentWednesdayScheduleIn
  currentWednesdayScheduleOut: string = this.formInput.currentWednesdayScheduleOut
  currentWednesdayScheduledHours: number = 0;
  currentWednesdayProjection: number = 0;

  currentThursdayScheduleIn: string = this.formInput.currentThursdayScheduleIn
  currentThursdayScheduleOut: string = this.formInput.currentThursdayScheduleOut
  currentThursdayScheduledHours: number = 0;
  currentThursdayProjection: number = 0;

  currentFridayScheduleIn: string = this.formInput.currentFridayScheduleIn
  currentFridayScheduleOut: string = this.formInput.currentFridayScheduleOut
  currentFridayScheduledHours: number = 0;
  currentFridayProjection: number = 0;

  currentSaturdayScheduleIn: string = this.formInput.currentSaturdayScheduleIn
  currentSaturdayScheduleOut: string = this.formInput.currentSaturdayScheduleOut
  currentSaturdayScheduledHours: number = 0;
  currentSaturdayProjection: number = 0;

  // Next week
  nextSundayIn: string = this.formInput.nextSundayIn
  nextSundayOut: string = this.formInput.nextSundayOut
  nextSundayHours: number = 0;
  nextSundayProjection: number = 0;

  nextMondayIn: string = this.formInput.nextMondayIn
  nextMondayOut: string = this.formInput.nextMondayOut
  nextMondayHours: number = 0;
  nextMondayProjection: number = 0;

  nextTuesdayIn: string = this.formInput.nextTuesdayIn
  nextTuesdayOut: string = this.formInput.nextTuesdayOut
  nextTuesdayHours: number = 0;
  nextTuesdayProjection: number = 0;

  nextWednesdayIn: string = this.formInput.nextWednesdayIn
  nextWednesdayOut: string = this.formInput.nextWednesdayOut
  nextWednesdayHours: number = 0;
  nextWednesdayProjection: number = 0;

  nextThursdayIn: string = this.formInput.nextThursdayIn
  nextThursdayOut: string = this.formInput.nextThursdayOut
  nextThursdayHours: number = 0;
  nextThursdayProjection: number = 0;

  nextFridayIn: string = this.formInput.nextFridayIn
  nextFridayOut: string = this.formInput.nextFridayOut
  nextFridayHours: number = 0;
  nextFridayProjection: number = 0;

  nextSaturdayIn: string = this.formInput.nextSaturdayIn
  nextSaturdayOut: string = this.formInput.nextSaturdayOut
  nextSaturdayHours: number = 0;
  nextSaturdayProjection: number = 0;

  constructor(
    private cookieService: CookieService,
    private fb: FormBuilder,
    private hoursService: HoursService,
    private dialogRef: MatDialog
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
        this.hoursForm.controls['payRate'].setValue(this.hours.payRate);

        // Previous Week In
        this.hoursForm.controls['previousSundayIn'].setValue(this.hours.previousWeekIn.sunday);
        this.hoursForm.controls['previousMondayIn'].setValue(this.hours.previousWeekIn.monday);
        this.hoursForm.controls['previousTuesdayIn'].setValue(this.hours.previousWeekIn.tuesday);
        this.hoursForm.controls['previousWednesdayIn'].setValue(this.hours.previousWeekIn.wednesday);
        this.hoursForm.controls['previousThursdayIn'].setValue(this.hours.previousWeekIn.thursday);
        this.hoursForm.controls['previousFridayIn'].setValue(this.hours.previousWeekIn.friday);
        this.hoursForm.controls['previousSaturdayIn'].setValue(this.hours.previousWeekIn.saturday);

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
      }
    })
  }

  saveHours() {

  }

  shiftHours() {

  }

  ngOnInit(): void {
  }

}
