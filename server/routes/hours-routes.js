/**
 * Title: hours-routes.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Hours Tracker APIs
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

// Logging and Validation
const myFile = "hours-routes.js";
const ajv = new Ajv();

// Schema for validation



/**
 * API: http://localhost:3000/api/hours-tracker
 */






module.exports = router;
