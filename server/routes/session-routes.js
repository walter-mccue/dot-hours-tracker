/**
 * Title: session-routes.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Session APIs
*/

// Require statements
const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { debugLogger, errorLogger } = require("../logs/logger");
const Ajv = require("ajv");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");
const bcrypt = require("bcryptjs");
const { async } = require("rxjs");

// Logging and Validation
const myFile = "session-routes.js";
const ajv = new Ajv();

// Schema for validation
const loginSchema = {
  type: "object",
  properties: {
    userName: { type: "string" },
    password: { type: "string" },
  },
  required: ["userName", "password"],
  additionalProperties: false,
};

const registerSchema = {
  type: "object",
  properties: {
    userName: { type: "string" },
    password: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    email: { type: "string" },
    selectedSecurityQuestions: { type: "array" },
  },
  required: [
    "userName",
    "password",
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "email",
    "selectedSecurityQuestions",
  ],
  additionalProperties: false,
};

const verifySecurityQuestionsSchema = {
  type: "object",
  properties: {
    questionText1: { type: "string" },
    answerText1: { type: "string" },
    questionText2: { type: "string" },
    answerText2: { type: "string" },
    questionText3: { type: "string" },
    answerText3: { type: "string" },
  },
  required: ["questionText1", "answerText1", "questionText2", "answerText2", "questionText3", "answerText3"],
  additionalProperties: false,
};

const resetPasswordSchema = {
  type: "object",
  properties: {
    password: { type: "string" },
  },
  required: ["password"],
  additionalProperties: false,
};

const saltRounds = 10;


/**
 * API: http://localhost:3000/api/session
 */





module.exports = router;
