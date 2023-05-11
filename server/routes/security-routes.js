/**
 * Title: security-routes.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Security Question APIs
*/

// Require statements
const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { debugLogger, errorLogger } = require("../logs/logger");
const Ajv = require("ajv");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");
const SecurityQuestion = require("../models/security-question");


// Logging and Validation
const myFile = "security-routes.js";
const ajv = new Ajv();

// Schema for  create and update validation
const securitySchema = {
  type: 'object',
  properties: {
    text: {type: 'string'}
  },
  required: ['text'],
  additionalProperties: false
}


/**
 * API: http://localhost:3000/api/security
 */






module.exports = router;
