/**
 * Title: hours.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Schema to define the hours-tracker collection
*/

// Require Statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const weeklyHoursSchema = require("../schemas/weekly-hours");

// Defining hours schema
let hoursSchema = new Schema(
  {
    hubId: { type: String, required: true, unique: true },
    previousWeekIn: weeklyHoursSchema,
    previousWeekOut: weeklyHoursSchema,
    currentWeekScheduleIn: weeklyHoursSchema,
    currentWeekScheduleOut: weeklyHoursSchema,
    currentWeekClockIn: weeklyHoursSchema,
    currentWeekClockOut: weeklyHoursSchema,
    nextWeekIn: weeklyHoursSchema,
    nextWeekOut: weeklyHoursSchema,
    payRate: {type: Number}

  },
  { collection: "hours-tracker" }
);

module.exports = mongoose.model("Hours", hoursSchema);
