/**
 * Title: hours-routes.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Hours Tracker APIs
*/


/**
 * API: http://localhost:3000/api/hours-tracker
 */


// Require statements
const express = require("express");
const router = express.Router();
const { debugLogger, errorLogger } = require("../logs/logger");
const Ajv = require("ajv");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");
const Hours = require("../models/hours");
const { async } = require("rxjs");


// Validation
const ajv = new Ajv();

// Schema for validation
const hoursSchema = {
  type: "object",
  properties: {
    hubId: { type: "string" },
    previousWeekIn: {
      type: "object",
        properties: {
          sunday: { type: "string" },
          monday: { type: "string" },
          tuesday: { type: "string" },
          wednesday: { type: "string" },
          thursday: { type: "string" },
          friday: { type: "string" },
          saturday: { type: "string" }
        },
        required: [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"],
        additionalProperties: false,
      },
    previousWeekOut: {
      type: "object",
        properties: {
          sunday: { type: "string" },
          monday: { type: "string" },
          tuesday: { type: "string" },
          wednesday: { type: "string" },
          thursday: { type: "string" },
          friday: { type: "string" },
          saturday: { type: "string" }
        },
        required: [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"],
        additionalProperties: false,
      },
    currentWeekScheduleIn: {
      type: "object",
        properties: {
          sunday: { type: "string" },
          monday: { type: "string" },
          tuesday: { type: "string" },
          wednesday: { type: "string" },
          thursday: { type: "string" },
          friday: { type: "string" },
          saturday: { type: "string" }
        },
        required: [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"],
        additionalProperties: false,
      },
    currentWeekScheduleOut: {
      type: "object",
        properties: {
          sunday: { type: "string" },
          monday: { type: "string" },
          tuesday: { type: "string" },
          wednesday: { type: "string" },
          thursday: { type: "string" },
          friday: { type: "string" },
          saturday: { type: "string" }
        },
        required: [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"],
        additionalProperties: false,
      },
    currentWeekClockIn: {
      type: "object",
        properties: {
          sunday: { type: "string" },
          monday: { type: "string" },
          tuesday: { type: "string" },
          wednesday: { type: "string" },
          thursday: { type: "string" },
          friday: { type: "string" },
          saturday: { type: "string" }
        },
        required: [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"],
        additionalProperties: false,
      },
    currentWeekClockOut: {
      type: "object",
        properties: {
          sunday: { type: "string" },
          monday: { type: "string" },
          tuesday: { type: "string" },
          wednesday: { type: "string" },
          thursday: { type: "string" },
          friday: { type: "string" },
          saturday: { type: "string" }
        },
        required: [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"],
        additionalProperties: false,
      },
    nextWeekIn: {
      type: "object",
        properties: {
          sunday: { type: "string" },
          monday: { type: "string" },
          tuesday: { type: "string" },
          wednesday: { type: "string" },
          thursday: { type: "string" },
          friday: { type: "string" },
          saturday: { type: "string" }
        },
        required: [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"],
        additionalProperties: false,
      },
    nextWeekOut: {
      type: "object",
        properties: {
          sunday: { type: "string" },
          monday: { type: "string" },
          tuesday: { type: "string" },
          wednesday: { type: "string" },
          thursday: { type: "string" },
          friday: { type: "string" },
          saturday: { type: "string" }
        },
        required: [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"],
        additionalProperties: false,
      },
    payRate: {type: "number"}

  },
  required: [
    "hubId",
    "previousWeekIn",
    "previousWeekOut",
    "currentWeekScheduleIn",
    "currentWeekScheduleOut",
    "currentWeekClockIn",
    "currentWeekClockOut",
    "nextWeekIn",
    "nextWeekOut",
    "payRate"
  ],
  additionalProperties: false,
};

// Logging
const myFile = "hours-routes.js";

function validError() { errorLogger({
  filename: myFile, message: "Bad request: Validation failure"});
}

function requestError() { errorLogger({
  filename: myFile, message: "Bad request: invalid path or id"});
}

function serverError() { errorLogger({
  filename: myFile, message: "Server error"});
}

function successResponse(responseData) { debugLogger({
  filename: myFile, message: "Successful Query", item: responseData});
}


/**
 * findHoursByHubId
 * @openapi
 * /api/hours-tracker/{hubId}:
 *   get:
 *     tags:
 *       - Hours
 *     description:  API that returns a users tracked hours by hubID
 *     summary: returns user by ID
 *     parameters:
 *       - name: hubId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Hourly document
 *       '404':
 *         description: Hours not found
 *       '500':
 *         description: Server exception
 */

// findHoursByHubId
router.get("/:hubId", async (req, res) => {
  try {

    let hubId = req.params.hubId

    // findOne function to find hours by hubId
    Hours.findOne({ hubId }, function (err, hours) {

      // If hubId is not found
      if (hours === null) {
        console.log(err);
        const hoursError = new ErrorResponse(
          404, "Bad request, invalid hubId", err);
        res.status(404).send(hoursError.toObject());
        requestError();
        return
      }

      // Successful Query
      console.log(hours);
      const hoursResponse = new BaseResponse(
        200, "Query Successful", hours);
      res.json(hoursResponse.toObject());
      successResponse(hours);
    });

  // Server Error
  } catch (e) {
    console.log(e);
    const hoursError = new ErrorResponse(
      500, "Internal server error", e);
    res.status(500).send(hoursError.toObject());
    serverError();
  }
});




//createHours






//updateHours






module.exports = router;
