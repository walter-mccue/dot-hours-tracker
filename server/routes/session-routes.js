/**
 * Title: session-routes.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Session APIs
*/


/**
 * API: http://localhost:3000/api/session
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

// Logging and Validation
const myFile = "session-routes.js";
const ajv = new Ajv();

// hashes password
const saltRounds = 10;

// Schema for login validation
const loginSchema = {
  type: "object",
  properties: {
    hubId: { type: "string" },
    password: { type: "string" },
  },
  required: ["hubId", "password"],
  additionalProperties: false,
};

// Schema for register validation
const registerSchema = {
  type: "object",
  properties: {
    hubId: { type: "string" },
    password: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    selectedSecurityQuestions: {
      type: "array",
      additionalProperties: false,
      items: {
        type: "object",
        properties: {
          "questionText": { type: "string" },
          "answerText": { type: "string" },
        },
        required: ["questionText", "answerText"],
        additionalProperties: false,
      }
    },
  },
  required: [
    "hubId",
    "password",
    "firstName",
    "lastName",
    "email",
    "selectedSecurityQuestions",
  ],
  additionalProperties: false,
};

// Schema for security questions validation
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

// Schema for password validation
const resetPasswordSchema = {
  type: "object",
  properties: {
    password: { type: "string" },
  },
  required: ["password"],
  additionalProperties: false,
};


/**
 * @openapi
 * /api/session/login:
 *   post:
 *     tags:
 *       - Session
 *     operationId: login
 *     description: Login with hubId and password.
 *     summary: Login with hubId and password.
 *     requestBody:
 *       description: Login with hubId and password.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hubId:
 *                 text:
 *                   type: string
 *               password:
 *                 text:
 *                   type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Login successful.
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Invalid login credentials.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Server expectations.
 */

// User login
router.post("/login", async (req, res) => {
  try {

    let userLogin = req.body;

    // Checks request body against the schema
    const validator = ajv.compile(loginSchema);
    const valid = validator(userLogin);

    // failed validation
    if (!valid) {
      console.log("Bad Request, unable to validate");
      const sessionError = new ErrorResponse(
        400, "Bad Request, unable to validate", valid);
      errorLogger({
        filename: myFile, message: "Bad Request, unable to validate"});
      res.status(400).send(sessionError.toObject());
      return;
    }

    // findOne function to find a user by hubId
    User.findOne({ hubId: req.body.hubId }, (err, user) => {

      // If user not found
      if (err) {
        console.log(err);
        const sessionError = new ErrorResponse(
          404, "Bad request, invalid path", err);
        errorLogger({ filename: myFile, message: "Bad request, invalid path" });
        res.status(404).send(sessionError.toObject());
      } else {
        console.log(user);

        // Compare the string password with the hashed password in the database
        if (user) {
          let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );

          // Valid password
          if (passwordIsValid) {
            console.log("Login successful");
            const sessionResponse = new BaseResponse(
              200, "Login successful", user);
            debugLogger({ filename: myFile, message: user });
            res.json(sessionResponse.toObject());
            return
          }

          // Invalid password
          console.log(`Invalid password or hubId: ${user.hubId}`);
          const sessionError = new BaseResponse(
            401, "Invalid password or hubId, please try again.", null);
          errorLogger({
            filename: myFile, message: "Invalid password or hubId"});
          res.status(401).send(sessionError.toObject());
          return
        }

        //  Invalid hubId
        console.log(`hubId: ${req.body.hubId} is invalid`);
        const sessionError = new BaseResponse(
          401, "Invalid password or hubId, please try again.", null);
        errorLogger({
          filename: myFile, message: "Invalid password or hubId"});
        res.status(401).send(sessionError.toObject());
      }
    });

  // Server Error
  } catch (err) {
    console.log(err);
    const sessionError = new ErrorResponse(
      500, "Internal server error", e.message);
    errorLogger({ filename: myFile, message: "Internal server error" });
    res.status(500).send(sessionError.toObject());
  }
});


// openapi language used to describe the API via swagger
/**
 * @openapi
 * /api/session/register:
 *   post:
 *     tags:
 *       - Session
 *     operationId: register
 *     description: Register a new user.
 *     summary: Register a new user.
 *     requestBody:
 *       description: Register a new user.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hubId:
 *                 text:
 *                   type: string
 *               password:
 *                 text:
 *                   type: string
 *               firstName:
 *                 text:
 *                   type: string
 *               lastName:
 *                 text:
 *                   type: string
 *               email:
 *                 text:
 *                   type: string
 *               selectedSecurityQuestions:
 *                 text:
 *                   type: array
 *                   items:
 *                     questionText:
 *                       type: string
 *                     answerText:
 *                       type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Successful registration.
 *       '400':
 *         description: Bad request.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Server expectations.
 */

// register
router.post("/register", async (req, res) => {
  try {

    let registerUser = req.body;

    // checks request body against the schema
    const validator = ajv.compile(registerSchema);
    const valid = validator(registerUser);

    // failed validation
    if (!valid) {
      console.log("Bad Request, unable to validate");
      const sessionError = new ErrorResponse(
        400, "Bad Request, unable to validate", registerUser);
      errorLogger({
        filename: myFile, message: "Bad Request, unable to validate"});
      res.status(400).send(sessionError.toObject());
      return;
    }

    // findOne function to find user by hubId
    User.findOne({ hubId: req.body.hubId }, (err, user) => {
      console.log("user --> " + user);

      // Server error
      if (err) {
        console.log(err);
        const sessionError = new ErrorResponse(
          401, "Bad request, hubId in use", err);
        errorLogger({ filename: myFile, message: "Bad request, hubId in use" });
        res.status(401).send(sessionError.toObject());
        return
      }

      // if the user does not exist then post the new information
      if (!user) {
        let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
        standardRole = {
          text: "standard",
        };

        // New user object
        let registeredUser = {
          hubId: req.body.hubId,
          password: hashedPassword,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          role: standardRole,
          selectedSecurityQuestions: req.body.selectedSecurityQuestions,
        };

        // Create the new user
        User.create(registeredUser, (err, newUser) => {

          // Server error
          if (err) {
            console.log(err);
            const sessionError = new ErrorResponse(
              500, "Internal server error", err);
            errorLogger({
              filename: myFile, message: "Internal server error"});
            res.status(500).send(sessionError.toObject());
            return
          }

          // Successful user creation
          console.log(newUser);
          const sessionResponse = new BaseResponse(
            200, "Query successful", newUser);
          debugLogger({ filename: myFile, message: newUser });
          res.json(sessionResponse.toObject());
          return
        });
      }
    });

  // Server error
  } catch (e) {
    console.log(err);
    const sessionError = new ErrorResponse(
      500, "Internal server error", e.message);
    errorLogger({ filename: myFile, message: "Internal server error" });
    res.status(500).send(sessionError.toObject());
  }
});


/**
 * verifyUser
 * @openapi
 * /api/session/verify/users/{hubId}:
 *   get:
 *     tags:
 *       - Session
 *     description:  API that verify users by hubId
 *     summary: Verify user by hubId
 *     parameters:
 *       - name: hubId
 *         in: path
 *         required: true
 *         description: hubId
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User document
 *       '400':
 *         description: Invalid hubId
 *       '404':
 *         description: hubId not found
 *       '500':
 *         description: Server exception
 */

// verifyUser
router.get("/verify/users/:hubId", async (req, res) => {
  try {

    // findOne function to find user by hubId
    User.findOne({ hubId: req.params.hubId }, function (err, user) {

      // 404 error if user not found
      if (err) {
        console.log(err);
        const sessionError = new ErrorResponse(
          404, "hubId not found", req.params.hubId);
        res.status(404).send(sessionError.toObject());
        errorLogger({ filename: myFile, message: "hubId not found" });
        return
      }

      // If user is found
      if (user) {
        console.log(user);
        const sessionResponse = new BaseResponse(
          200, "Query successful", user);
        res.json(sessionResponse.toObject());
        debugLogger({ filename: myFile, message: user });
        return
      }

      // If hubId is invalid
      const sessionError = new ErrorResponse(
        400, "Invalid hubId", req.params.hubId);
      res.status(400).send(sessionError.toObject());
      errorLogger({ filename: myFile, message: "Invalid hubId" });
    });

  // Server error
  } catch (e) {
    console.log(e);
    const sessionError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(sessionError.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});


/**
 * @openapi
 * /api/session/verify/users/{hubId}/security-questions:
 *   post:
 *     tags:
 *       - Session
 *     name: verifySecurityQuestions
 *     description: Verifies that a user's input to confirm security questions matches what is stored in the database.
 *     summary: Verify a user's security questions against MongoDB
 *     operationId: verifySecurityQuestions
 *     parameters:
 *       - name: hubId
 *         in: path
 *         required: true
 *         description: findOne function to find the selected security questions of the selected hubId
 *         scheme:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: The security questions and answers
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionText1
 *               - questionText2
 *               - questionText3
 *               - answerText1
 *               - answerText2
 *               - answerText3
 *             properties:
 *               questionText1:
 *                 type: string
 *               questionText2:
 *                 type: string
 *               questionText3:
 *                 type: string
 *               answerText1:
 *                 type: string
 *               answerText2:
 *                 type: string
 *               answerText3:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Verified security question
 *       '400':
 *         description: Bad request, unable to validate
 *       '401':
 *         description: User failed to answer security questions correctly
 *       '404':
 *         description: Bad request, invalid hubId
 *       '500':
 *         description: Server Exception
 */

// Verify Security Question
router.post("/verify/users/:hubId/security-questions", async (req, res) => {
  try {

    let verifySecurityQuestions = req.body;

    // Checks request body against the schema
    const validator = ajv.compile(verifySecurityQuestionsSchema);
    const valid = validator(verifySecurityQuestions);

    // Failed validation
    if (!valid) {
      console.log("Bad Request, unable to validate");
      const sessionError = new ErrorResponse(
        400, "Bad Request, unable to validate", verifySecurityQuestions);
      errorLogger({
        filename: myFile, message: "Bad Request, unable to validate"});
      res.status(400).send(sessionError.toObject());
      return;
    }

    // findOne function for user
    User.findOne({ hubId: req.params.hubId }, function (err, user) {

      // If hubId not found
      if (err) {
        console.log(err);
        const sessionError = new ErrorResponse(
          404, "Bad request, invalid hubId", err);
        res.status(404).send(sessionError.toObject());
        errorLogger({
          filename: myFile, message: "Bad request, invalid hubId"});
        return;
      }

      // If user is valid
      console.log(user);

      // Variables to gather the selected questions
      const selectedSecurityQuestionOne = user.selectedSecurityQuestions.find(
        (q) => q.questionText === req.body.questionText1
      );
      const selectedSecurityQuestionTwo = user.selectedSecurityQuestions.find(
        (q2) => q2.questionText === req.body.questionText2
      );
      const selectedSecurityQuestionThree = user.selectedSecurityQuestions.find(
        (q3) => q3.questionText === req.body.questionText3
      );

      // Variables to compare the selected answers against the answers stored in the database
      const isValidAnswerOne =
        selectedSecurityQuestionOne.answerText === req.body.answerText1;
      const isValidAnswerTwo =
        selectedSecurityQuestionTwo.answerText === req.body.answerText2;
      const isValidAnswerThree =
        selectedSecurityQuestionThree.answerText === req.body.answerText3;

      // If all three security questions are valid
      if (isValidAnswerOne && isValidAnswerTwo && isValidAnswerThree) {
        console.log(
          `User ${user.hubId} answered security questions correctly`);
        const sessionResponse = new BaseResponse(200, "success", user);
        res.json(sessionResponse.toObject());
        debugLogger({ filename: myFile, message: user });
        return;
      }

      // If any of the three security questions are invalid
      console.log(
        `User ${user.hubId} failed to answer security questions correctly`);
      const sessionError = new BaseResponse(401, "error", user);
      res.json(sessionError.toObject());
      errorLogger({
        filename: myFile,
        message: `User ${user.hubId} failed to answer security questions correctly`});
    });

    // Server Error
  } catch (e) {
    console.log(e);
    const sessionError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(sessionError.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});


/**
 * @openapi
 * /api/session/users/{hubId}/reset-password:
 *   post:
 *     tags:
 *       - Session
 *     operationId: Reset Password
 *     description: Resets user password.
 *     summary: Resets Password.
 *     parameters:
 *       - name: hubId
 *         in: path
 *         required: true
 *         description: hubId
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New password.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 text:
 *                   type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Password reset successful.
 *       '400':
 *         description: Bad request.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Server expectations.
 */

// ResetPassword
router.post("/users/:hubId/reset-password", async (req, res) => {
  try {

    let newPassword = req.body;

    // Checks request body against the schema
    const validator = ajv.compile(resetPasswordSchema);
    const valid = validator(newPassword);

    // Failed validation
    if (!valid) {
      console.log("Bad Request, unable to validate");
      const sessionError = new ErrorResponse(
        400, "Bad Request, unable to validate", newPassword);
      errorLogger({
        filename: myFile, message: "Bad Request, unable to validate"});
      res.status(400).send(sessionError.toObject());
      return;
    }

    // findOne function to find user by hubId
    User.findOne({ hubId: req.params.hubId }, function (err, user) {

      // If user not found
      if (err) {
        console.log(err);
        const sessionError = new ErrorResponse(
          404, "Bad request, user not found", err);
        res.status(500).send(sessionError.toObject());
        errorLogger({
          filename: myFile, message: "Bad Request, user not found"});
        return
      }

      // If user is found
      console.log(user);
      password = req.body.password

      let hashedPassword = bcrypt.hashSync(password, saltRounds);
      user.set({ password: hashedPassword });

      // Saves new password for the user
      user.save(function (err, updatedUser) {

        //If error
        if (err) {
          console.log(err);
          const sessionError = new ErrorResponse(
            500, "Server Error", err);
          res.status(500).send(sessionError.toObject());
          errorLogger({
            filename: myFile, message: "Server Error"});
          return
        }

        // Successful Query
        console.log(updatedUser);
        const sessionResponse = new BaseResponse(
          200, "Query Successful", updatedUser);
        res.json(sessionResponse.toObject());
        debugLogger({ filename: myFile, message: updatedUser });
      });

    });
  } catch (e) {
    console.log(e);
    const sessionError = new ErrorResponse(
      500, "Internal server error", e);
    res.status(500).send(sessionError.toObject());
    errorLogger({
      filename: myFile, message: "Internal Server Error"});
  }
});


module.exports = router;
