/**
 * Title: hours.service.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Hours service to direct API calls
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hours } from '../models/hours';

@Injectable({
  providedIn: 'root'
})

export class HoursService {

  constructor(private http: HttpClient) { }

  // findHoursByHubId
  findHoursByHubId(hubId: string): Observable<any> {
    return this.http.get('/api/hours-tracker/' + hubId);
  }

  // createHours
  createHours(hubId: string, hours: Hours): Observable<any> {
    return this.http.post('/api/hours-tracker/' + hubId, {
      previousWeekIn: hours.previousWeekIn,
      previousWeekOut: hours.previousWeekOut,
      currentWeekScheduleIn: hours.currentWeekScheduleIn,
      currentWeekScheduleOut: hours.currentWeekScheduleOut,
      currentWeekClockIn: hours.currentWeekClockIn,
      currentWeekClockOut: hours.currentWeekClockOut,
      nextWeekIn: hours.nextWeekIn,
      nextWeekOut: hours.nextWeekOut,
      payRate: hours.payRate
    });
  }

  //updateHours
  updateHours(hubId: string, hours: Hours): Observable<any> {
    return this.http.put('/api/hours-tracker/' + hubId, {
      previousWeekIn: hours.previousWeekIn,
      previousWeekOut: hours.previousWeekOut,
      currentWeekScheduleIn: hours.currentWeekScheduleIn,
      currentWeekScheduleOut: hours.currentWeekScheduleOut,
      currentWeekClockIn: hours.currentWeekClockIn,
      currentWeekClockOut: hours.currentWeekClockOut,
      nextWeekIn: hours.nextWeekIn,
      nextWeekOut: hours.nextWeekOut,
      payRate: hours.payRate
    });
  }

}
