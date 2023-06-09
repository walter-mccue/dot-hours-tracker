/**
 * Title: security-routes.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Security Question APIs
 * References: See references.log: line 1
*/


/**
 * API: http://localhost:3000/api/security
 */


// Require statements
const express = require("express");
const router = express.Router();
const { debugLogger, errorLogger } = require("../logs/logger");
const Ajv = require("ajv");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");
const SecurityQuestion = require("../models/security-question");


// Validation
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


// Logging
const myFile = "security-routes.js";

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
 * findAllSecurityQuestions
 * @openapi
 * /api/security:
 *   get:
 *     tags:
 *       - SecurityQuestions
 *     description:  API for viewing all security questions
 *     summary: view all security questions
 *     responses:
 *       '200':
 *         description: Successful Query
 *       '500':
 *         description: Server error
 */

// findAllSecurityQuestions
router.get("/", async (req, res) => {
  try {

    // find function to find all Security Questions that are not disabled
    SecurityQuestion.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (err, securityQuestions) {

        // Server error
        if (err) {
          console.log(err);
          const securityError = new ErrorResponse(
            500, "Server error.", err);
          res.status(500).send(securityError.toObject());
          serverError(err);
          return
        }

        // Successful Query
        console.log(securityQuestions);
        const securityResponse = new BaseResponse(
          200, "Query Successful", securityQuestions);
        res.json(securityResponse.toObject());
        successResponse(securityQuestions);

      }
    );

   // Server error
  } catch (e) {
    console.log(e);
    const securityError = new ErrorResponse(
      500, "Internal server error", e.message);
   res.status(500).send(securityError.toObject());
    serverError(e.message);
  }
});


/**
 * @openapi
 * /api/security/{id}:
 *   get:
 *     tags:
 *       - SecurityQuestions
 *     operationId: findById
 *     description: API to find the security questions.
 *     summary: Returns an object matching the object ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Return a security question document.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 text:
 *                   type: string
 *                 isDisabled:
 *                   type: Boolean
 *       '200':
 *         description: Successful Query.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Server error.
 */

// findById
router.get("/:id", async (req, res) => {
  try {

    // Find question by _id
    SecurityQuestion.findOne({ _id: req.params.id }, (err, securityQuestion) => {

        // 404 Error if question is not found
        if (securityQuestion === undefined) {
          console.log(err);
          const securityError = new ErrorResponse(
            404, "Bad request, invalid _id", err);
          res.status(404).send(securityError.toObject());
          requestError(req.params.id);
          return
        }

        if (err) {
          console.log(err);
          const securityError = new ErrorResponse(
            500, "Server Error", err);
          res.status(500).send(securityError.toObject());
          serverError(err);
          return
        }

        // Successful Query
        console.log(securityQuestion);
        const securityResponse = new BaseResponse(
          200, "Query successful", securityQuestion);
        res.json(securityResponse.toObject());
        successResponse(securityQuestion);
      }
    );

  // Server error
  } catch (e) {
    console.log(e);
    const securityError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(securityError.toObject());
    serverError(e.message);
  }
});


/**
 * createSecurityQuestion
 * @openapi
 * /api/security:
 *   post:
 *     tags:
 *       - SecurityQuestions
 *     description: API that creates a new security question.
 *     summary: Creates a new new security question
 *     requestBody:
 *       description: Creates a new new security question
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       '200':
 *         description: New security question added to MongoDB
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Server Exception
 */

// createSecurityQuestion
router.post("/", async (req, res) => {
  try {

    let newSecurityQuestion = req.body

    // Checks current request body against the schema
    const validator = ajv.compile(securitySchema);
    const valid = validator(newSecurityQuestion)

    // If invalid return 400 Error
    if (!valid) {
      console.log('Bad Request, unable to validate');
      const createServiceError = new ErrorResponse(
        400, 'Bad Request, unable to validate', newSecurityQuestion);
      res.status(400).send(createServiceError.toObject());
      validError(newSecurityQuestion);
      return
    }

    // create Security Question function
    SecurityQuestion.create(
      newSecurityQuestion,
      function (err, securityQuestion) {

        // Server error
        if (err) {
          console.log(err);
          const securityError = new ErrorResponse(
            500, "Server error", err);
          res.status(500).send(securityError.toObject());
          requestError(err);
          return
        }
        console.log(securityQuestion);
        const securityResponse = new BaseResponse(
          200, "Query Successful", securityQuestion);
        res.json(securityResponse.toObject());
        successResponse(securityQuestion);
      }
    );

  // Server error
  } catch (e) {
    console.log(e);
    const securityError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(securityError.toObject());
    serverError(e.message);
  }
});


/**
 * updateSecurityQuestions
 * @openapi
 * /api/security/{id}:
 *   put:
 *     tags:
 *       - SecurityQuestions
 *     description: API that updates security questions by id
 *     summary: Updates security questions
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: question id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Creates a new new security question
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       '204':
 *         description: Question updated
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Server error
 */

// updateSecurityQuestion
router.put("/:id", async (req, res) => {
  try {

    let updateSecurityQuestion = req.body

    // Checks current request body against the schema
    const validator = ajv.compile(securitySchema);
    const valid = validator(updateSecurityQuestion)

    // If invalid return 400 Error
    if (!valid) {
      console.log('Bad Request, unable to validate');
      const securityError = new ErrorResponse(
        400, 'Bad Request, unable to validate', updateSecurityQuestion);
      res.status(400).send(securityError.toObject());
      validError(securityError);
      return
    }

    // findOne function to find Security Question by _id
    SecurityQuestion.findOne(
      { _id: req.params.id },
      function (err, securityQuestion) {

        // 404 error if _id is not found
        if (securityQuestion === undefined) {
          console.log(err);
          const securityError = new ErrorResponse(
            404, "Bad request, _id not valid", err);
          res.status(404).send(securityError.toObject());
          requestError(req.params.id);
          return
        }

        // Server error
        if (err) {
          console.log(err);
          const securityError = new ErrorResponse(
            500, "Server error", err);
          res.status(500).send(securityError.toObject());
          serverError(err);
          return
        }

        // If Security Question _id is valid
        console.log(securityQuestion);

        securityQuestion.set({ text: req.body.text });

        // Updates Security Question
        securityQuestion.save(function (err, savedSecurityQuestion) {

          // Server error
          if (err) {
            console.log(err);
            const securityError = new ErrorResponse(
              500, "Server error", err);
            res.status(500).send(securityError.toObject());
            serverError(err);
            return
          }

          // Successful query
          console.log(savedSecurityQuestion);
          const securityResponse = new BaseResponse(
            204, "Query successful", savedSecurityQuestion);
          res.json(securityResponse.toObject());
          successResponse(savedSecurityQuestion);
        });
      }
    );

  // Server error
  } catch (e) {
    console.log(e);
    const securityError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(securityError.toObject());
    serverError(e.message);
  }
});


/**
 * deleteSecurityQuestionById
 * @openapi
 * /api/security/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     name: deleteSecurityQuestion
 *     description: API for deleting a document.
 *     summary: Sets the isDisabled status to true.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the document to remove.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Service disabled
 *       '404':
 *         description: Bad Request
 *       '500':
 *         description: Server Exception
 */

// deleteSecurity
router.delete('/:id', async (req, res) => {

  try {

    // findOne function to find Security Question by _id
    SecurityQuestion.findOne({ _id: req.params.id }, (err, securityQuestion) => {

      // 404 error if _id is not found
      if (securityQuestion === undefined) {
        console.log(err);
        const securityError = new ErrorResponse(
          404, "Bad Request, _id not valid", err);
        res.status(404).send(securityError.toObject());
        requestError(req.params.id);
        return
      }

      // Server error
      if (err) {
        console.log(err);
        const securityError = new ErrorResponse(
          500, "Server error", err);
        res.status(500).send(securityError.toObject());
        requestError(err);
        return
      }

      // If _id is found
      console.log(securityQuestion)
      securityQuestion.set({ isDisabled: true });

      // save function to disable the Security Question
      securityQuestion.save(function (err, savedSecurityQuestion) {

        // Server error
        if (err) {
          console.log(err);
          const securityError = ErrorResponse(
            500, "Server error", err);
          res.status(500).send(securityError.toObject());
          serverError(err);
          return
        }

        // Successful query
        console.log(savedSecurityQuestion);
        const securityResponse = new BaseResponse(
          204, "Query successful", savedSecurityQuestion);
        res.json(securityResponse.toObject());
        successResponse(savedSecurityQuestion);
      });
    });

  // Server error
  } catch (e) {
    console.log(e);
    const securityError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(securityError.toObject());
    serverError(e.message);
  }
});


module.exports = router;
