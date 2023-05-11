/**
 * Title: roles-routes.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Role APIs
*/

// Require statements
const express = require("express");
const router = express.Router();
const { debugLogger, errorLogger } = require("../logs/logger");
const Ajv = require("ajv");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");
const User = require("../models/user");
const Role = require("../models/role");
const { async } = require("rxjs");

// Logging and Validation
const myFile = "roles-routes.js";
const ajv = new Ajv();

// Schema for  create and update validation
const roleSchema = {
  type: 'object',
  properties: {
    text: {type: 'string'}
  },
  required: ['text'],
  additionalProperties: false
}


/**
 * API: http://localhost:3000/api/roles
 */






module.exports = router;
