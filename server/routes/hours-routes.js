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
const User = require("../models/user");


// Validation
const ajv = new Ajv();

// Schema for validation
const hoursSchema = {
  type: "object",
  properties: {
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

function validError(responseError) { errorLogger({
  filename: myFile,
  message: "Bad request: Validation failure",
  item: responseError});
}

function requestError(responseError) { errorLogger({
  filename: myFile,
  message: "Bad request: invalid path or id",
  item: responseError});
}

function serverError(responseError) { errorLogger({
  filename: myFile,
  message: "Server error",
  item: responseError});
}

function successResponse(responseData) { debugLogger({
  filename: myFile,
  message: "Successful Query",
  item: responseData});
}


/**
 * findHoursByHubId
 * @openapi
 * /api/hours-tracker/{hubId}:
 *   get:
 *     tags:
 *       - Hours
 *     description:  API that returns a hourss tracked hours by hubID
 *     summary: returns hours by ID
 *     parameters:
 *       - name: hubId
 *         in: path
 *         required: true
 *         description: hours ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Hourly document
 *       '404':
 *         description: Hours not found
 *       '500':
 *         description: Server error
 */

// findHoursByHubId
router.get("/:hubId", async (req, res) => {
  try {

    let hubId = req.params.hubId

    // findOne function to find hours by hubId
    Hours.findOne({ hubId }, function (err, hours) {

      // If no record is not found
      if (hours === null) {
        console.log(err);
        const hoursError = new ErrorResponse(
          404, "Bad request, invalid hubId", err);
        res.status(404).send(hoursError.toObject());
        requestError(hubId);
        return
      }

      // Server error
      if (err) {
        console.log(err);
        const hoursError = new ErrorResponse(
          500, "Server error", err);
        res.status(500).send(hoursError.toObject());
        requestError(err);
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
      500, "Internal server error", e.message);
    res.status(500).send(hoursError.toObject());
    serverError(e.message);
  }
});


/**
 * createHours
 * @openapi
 * /api/hours-tracker/{hubId}/:
 *   post:
 *     tags:
 *       - hours
 *     description: API that creates an hourly tracker for a hours
 *     summary: Creates a hourly tracker document
 *     requestBody:
 *       description: Creates a new hourly tracker document
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hubId:
 *                 type: string
 *               previousWeekIn:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               previousWeekOut:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               currentWeekScheduleIn:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               currentWeekScheduleOut:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               currentWeekClockIn:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               currentWeekClockOut:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               nextWeekIn:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               nextWeekOut:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               payRate:
 *                 type: number
 *     responses:
 *       '200':
 *         description: New hourly tracker added to MongoDB
 *       '400':
 *         description: Bad Validation
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null Record
 *       '500':
 *         description: Server Exception
 */

// createHours
router.post("/:hubId", async (req, res) => {
  try {

    let hubId = req.params.hubId
    let newHours = req.body;

    // Checks current request body against the schema
    const validator = ajv.compile(hoursSchema);
    const valid = validator(newHours);

    // If invalid return 400 Error
    if (!valid) {
      console.log("Bad Request, unable to validate");
      const hoursError = new ErrorResponse(
        400, "Bad Request, unable to validate", newHours);
      res.status(400).send(hoursError.toObject());
      validError(newHours);
      return;
    }

    // findOne function to find hours by hubId
    Hours.findOne({ hubId }, (err, hours) => {
      console.log("hours --> " + hours);

      // If hours have already been created
      if (hours) {
        console.log(err);
        const hoursError = new ErrorResponse(
          401, "Bad request, hours already created", err);
        res.status(401).send(hoursError.toObject());
        errorLogger({
          filename: myFile,
          message: "Bad request, hours already created",
          item: req.body.hubId });
        return
      }

      // Server error
      if (err) {
        console.log(err);
        const hoursError = new ErrorResponse(
          500, "Server error", err);
        res.status(500).send(hoursError.toObject());
        serverError(req.body.hubId);
        return
      }

      // If hours have not already been created
      if (!hours) {

        // findOne function to find user by hubId
        User.findOne({ hubId: req.params.hubId }, (err, user) => {
          console.log("user --> " + user);

          // If user not found
          if (!user) {
            console.log(err);
            const sessionError = new ErrorResponse(
              404, "Bad request, user not found", err);
            res.status(404).send(sessionError.toObject());
            errorLogger({
              filename: myFile,
              message: "Bad request, user not found",
              item: req.params.hubId });
            return
          }

          // Server error
          if (err) {
            console.log(err);
            const sessionError = new ErrorResponse(
              500, "Server error", err);
            res.status(500).send(sessionError.toObject());
            serverError(req.body.hubId);
            return
          }

          // If user exists and hours do not exist, create hours
          if (user) {

            // New hours Object to be saved to the database
            let createHours = {
              hubId: req.params.hubId,
              previousWeekIn: newHours.previousWeekIn,
              previousWeekOut: newHours.previousWeekOut,
              currentWeekScheduleIn: newHours.currentWeekScheduleIn,
              currentWeekScheduleOut: newHours.currentWeekScheduleOut,
              currentWeekClockIn: newHours.currentWeekClockIn,
              currentWeekClockOut: newHours.currentWeekClockOut,
              nextWeekIn: newHours.nextWeekIn,
              nextWeekOut: newHours.nextWeekOut,
              payRate: newHours.payRate
            };

            // create function for the hours object
            Hours.create(createHours, function (err, newHours) {

              // Server error
              if (err) {
                console.log(err);
                const hoursError = new ErrorResponse(
                  500, "Server error", err);
                res.status(500).send(hoursError.toObject());
                serverError(err);
                return
              }

              // Successful post
              console.log(newHours);
              const hoursResponse = new BaseResponse(
                200, "Query successful", newHours);
              res.json(hoursResponse.toObject());
              successResponse(newHours);
            });
          }
        });
      }
    });

  // Server error
  } catch (e) {
    console.log(e);
    const hoursError = ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(hoursError.toObject());
    serverError(e.message);
  }
});


/**
 * updateHours
 * @openapi
 * /api/hours-tracker/{hubId}:
 *   put:
 *     tags:
 *       - hours
 *     description: API that updates an hourly tracker for a hours
 *     summary: Updates a hourly tracker document
 *     requestBody:
 *       description: Updates a new hourly tracker document
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hubId:
 *                 type: string
 *               previousWeekIn:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               previousWeekOut:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               currentWeekScheduleIn:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               currentWeekScheduleOut:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               currentWeekClockIn:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               currentWeekClockOut:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               nextWeekIn:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               nextWeekOut:
 *                 type: object
 *                 properties:
 *                   sunday:
 *                     type: string
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *               payRate:
 *                 type: number
 *     responses:
 *       '200':
 *         description: New hourly tracker updated
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null Record
 *       '500':
 *         description: Server Exception
 */

// updateHours
router.put("/:hubId", async (req, res) => {
  try {

    let hubId = req.params.hubId
    let updateHours = req.body;

    // Checks current request body against the schema
    const validator = ajv.compile(hoursSchema);
    const valid = validator(updateHours);

    // If invalid return 400 Error
    if (!valid) {
      console.log("Bad Request, unable to validate");
      const hoursError = new ErrorResponse(
        400, "Bad Request, unable to validate", updateHours);
      res.status(400).send(hoursError.toObject());
      validError(updateHours);
      return;
    }

    // findOne function to find hours by hubId
    Hours.findOne({ hubId }, (err, hours) => {

      // 404 error if hours not found
      if (hours === null) {
        console.log(err);
        const hoursError = new ErrorResponse(
          404, "Bad request, Hours not found", err);
        res.status(404).send(hoursError.toObject());
        serverError(req.body.hubId);
        return
      }

      // Server error
      if (err) {
        console.log(err);
        const hoursError = new ErrorResponse(
          500, "Server error", err);
        res.status(500).send(hoursError.toObject());
        serverError(req.body.hubId);
        return
      }
      console.log(hours)

      // Updated hours Object to be saved to the database
      hours.set({
        hubId: req.params.hubId,
        previousWeekIn: updateHours.previousWeekIn,
        previousWeekOut: updateHours.previousWeekOut,
        currentWeekScheduleIn: updateHours.currentWeekScheduleIn,
        currentWeekScheduleOut: updateHours.currentWeekScheduleOut,
        currentWeekClockIn: updateHours.currentWeekClockIn,
        currentWeekClockOut: updateHours.currentWeekClockOut,
        nextWeekIn: updateHours.nextWeekIn,
        nextWeekOut: updateHours.nextWeekOut,
        payRate: updateHours.payRate,
        dateModified: new Date()
      });

      // save function for the hours object
      hours.save(function (err, updatedHours) {

        // Server error
        if (err) {
          console.log(err);
          const hoursError = new ErrorResponse(
            500, "Server error", err);
          res.status(500).send(hoursError.toObject());
          serverError(err);
          return
        }

        // Successful post
        console.log(updatedHours);
        const hoursResponse = new BaseResponse(
          200, "Query successful", updatedHours);
        res.json(hoursResponse.toObject());
        successResponse(updatedHours);
      });
    });

  // Server error
  } catch (e) {
    console.log(e);
    const hoursError = ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(hoursError.toObject());
    serverError(e.message);
  }
});


module.exports = router;
