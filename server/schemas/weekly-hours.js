/**
 * Title: weekly-hours.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Schema to define the weekly hours
*/

// Require statements
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define weekly-hours schema
let weeklyHoursSchema = new Schema({
  sunday: { type: String },
  monday: { type: String },
  tuesday: { type: String },
  wednesday: { type: String },
  thursday: { type: String },
  friday: { type: String },
  saturday: { type: String }
})

module.exports = weeklyHoursSchema;
