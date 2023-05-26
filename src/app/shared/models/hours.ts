/**
 * Title: hours.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Interface for the Hours schema
*/

import { FullWeek } from "./full-week"

export interface Hours {
  hubId: string,
  previousWeekIn: FullWeek,
  previousWeekOut: FullWeek,
  currentWeekScheduleIn: FullWeek,
  currentWeekScheduleOut: FullWeek,
  currentWeekClockIn: FullWeek,
  currentWeekClockOut: FullWeek,
  nextWeekIn: FullWeek,
  nextWeekOut: FullWeek,
  payRate: number
}
