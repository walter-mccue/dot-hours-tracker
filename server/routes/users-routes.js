/**
 * Title: user-routes.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: User APIs
*/

// Require statements
const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { debugLogger, errorLogger } = require("../logs/logger");
const createError = require("http-errors");
const Ajv = require("ajv");
const bcrypt = require("bcryptjs");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");

// Logging and Validation
const myFile = "users-routes.js";
const ajv = new Ajv();
const saltRounds = 10; // hashes password

// Schema for  create validation
const userSchema = {
  type: "object",
  properties: {
    userName: { type: "string" },
    password: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    email: { type: "string" },
  },
  required: [
    "userName",
    "password",
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "email",
  ],
  additionalProperties: false,
};

const updateUserSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    email: { type: "string" },
    role: {
      properties : {
        text: { type: 'string' }
      },
      required: ['text'],
      additionalProperties: false
    }
  },
  required: [
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "email" ,
    'role',
  ],
  additionalProperties: false,
};

/**
 * API: http://localhost:3000/api/users
 */





module.exports = router;
