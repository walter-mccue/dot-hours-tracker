/**
 * Title: user-routes.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: User APIs
*/


/**
 * API: http://localhost:3000/api/users
 */


// Require statements
const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { debugLogger, errorLogger } = require("../logs/logger");
const Ajv = require("ajv");
const bcrypt = require("bcryptjs");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");


// hashes password
const saltRounds = 10;


// Validation
const ajv = new Ajv();

// Schema for  create validation
const userSchema = {
  type: "object",
  properties: {
    hubId: { type: "string" },
    password: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
  },
  required: [
    "hubId",
    "password",
    "firstName",
    "lastName",
    "email",
  ],
  additionalProperties: false,
};

// Schema for  update validation
const updateUserSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
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
    "email" ,
    'role',
  ],
  additionalProperties: false,
};


// Logging
const myFile = "users-routes.js";

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
 * findAllUsers
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     summary: Returns all users
 *     responses:
 *       '200':
 *         description: Returned all users
 *       '404':
 *         description: Documents not found
 *       '500':
 *         description: Server Error
 */

// findAllUsers
router.get("/", async (req, res) => {
  try {
    User.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (err, users) {

        // Server Error
        if (err) {
          const userError = new ErrorResponse(
            404, "Bad request, path not found.", err.message);
          res.status(404).send(userError.toObject());
          requestError();
          return;
        }

        // Successful Query
        console.log(users);
        const userResponse = new BaseResponse(
          200, "Query Successful", users);
        res.json(userResponse.toObject());
        successResponse(users);
      });

    // Server Error
  } catch (e) {
    const userError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(userError.toObject());
    serverError();
  }
});


/**
 * findUserById
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description:  API that returns user by ID
 *     summary: returns user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User document
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server exception
 */

// findUserById
router.get("/:id", async (req, res) => {
  try {

    // findOne function to find user by _id
    User.findOne({ _id: req.params.id }, function (err, user) {

      // If user is not found
      if (err) {
        console.log(err);
        const userError = new ErrorResponse(
          404, "Bad request, invalid UserId", err);
        res.status(404).send(userError.toObject());
        requestError();
        return
      }

      // Successful Query
      console.log(user);
      const userResponse = new BaseResponse(
        200, "Query Successful", user);
      res.json(userResponse.toObject());
      successResponse(user);
    });

  // Server Error
  } catch (e) {
    console.log(e);
    const userError = new ErrorResponse(
      500, "Internal server error", e);
    res.status(500).send(userError.toObject());
    serverError();
  }
});


/**
 * createUser
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     description: API that creates a new user
 *     summary: Creates a new user
 *     requestBody:
 *       description: Creates a new user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               hubId:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       '200':
 *         description: New user added to MongoDB
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null Record
 *       '500':
 *         description: Server Exception
 */

// createUser
router.post("/", async (req, res) => {
  try {

    // Password encryption
    let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

    // Sets the default user role to standard
    standardRole = {
      text: "standard",
    };

    // User object from the request body
    let newUser = req.body;

    // Checks current request body against the schema
    const validator = ajv.compile(userSchema);
    const valid = validator(newUser);

    // If invalid return 400 Error
    if (!valid) {
      console.log("Bad Request, unable to validate");
      const userError = new ErrorResponse(
        400, "Bad Request, unable to validate", valid);
      res.status(400).send(userError.toObject());
      validError();
      return;
    }

    // New User Object to be saved to the database
    createUser = {
      hubId: newUser.hubId,
      password: hashedPassword,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: standardRole,
    };

    // create function for the user object
    User.create(createUser, function (err, user) {

      // If error
      if (err) {
        console.log(err);
        const userError = new ErrorResponse(
          404, "Bad request, please ensure request meets requirements.", err);
        res.status(404).send(userError.toObject());
        errorLogger({
          filename: myFile,
          message: "Bad request, please ensure request meets requirements."});
        return
      }

      // Successful post
      console.log(user);
      const userResponse = new BaseResponse(
        200, "Query successful", user);
      res.json(userResponse.toObject());
      successResponse(user);
    });

  // Server error
  } catch (e) {
    console.log(e);
    const userError = ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(userError.toObject());
    serverError();
  }
});


/**
 * updateUser
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     description: API that updates users
 *     summary: Updates Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type:
 *     requestBody:
 *       description: Update user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '204':
 *         description: User updated
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server Exception
 */

// updateUser
router.put("/:id", async (req, res) => {
  try {

    // User object from the request body
    let updatedUser = req.body;

    // Checks current request body against the schema
    const validator = ajv.compile(updateUserSchema);
    const valid = validator(updatedUser);

    // If invalid return 400 Error
    if (!valid) {
      console.log("Bad Request, unable to validate");
      const userError = new ErrorResponse(
        400, "Bad Request, unable to validate", valid);
      res.status(400).send(userError.toObject());
      validError();
      return;
    }

    // findOne function to find the user by _id
    User.findOne({ _id: req.params.id }, function (err, user) {

      // 404 error if user._id is not found
      if (err) {
        console.log(err);
        const userError = new ErrorResponse(
          404, "Bad request, id not found", err);
        res.status(404).send(userError.toObject());
        requestError();
        return
      }

      // If user._id is valid, saves user data
      console.log(user);
      user.set({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
        dateModified: new Date(),
      });

      // put function to save the updated user object
      user.save(function (err, savedUser) {

        // If error
        if (err) {
          console.log(err);
          const userError = new ErrorResponse(
            500, "Server Error", err);
          res.status(500).send(userError.toObject());
          serverError();
          return
        }
          // Successful Put
          console.log(savedUser);
          const userResponse = new BaseResponse(
            204, "Query successful", savedUser);
          res.json(userResponse.toObject());
          successResponse(savedUser);
      });
    });

    //Server error
  } catch (e) {
    console.log(e);
    const userError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(userError.toObject());
    serverError();
  }
});


/**
 * deleteUserById
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     name: deleteUser
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
 *       '200':
 *         description: Service disabled
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Document not found
 *       '500':
 *         description: Server Exception
 */

// deleteUser
router.delete("/:id", async (req, res) => {
  try {

    // findOne function to find user by _id
    User.findOne({ _id: req.params.id }, function (err, user) {

      // Server error
      if (err) {
        console.log(err);
        const userError = new ErrorResponse(
          404, "Bad request, invalid UserId", err.message);
        res.status(404).send(userError.toObject());
        requestError();
        return;
      }

      // sets disabled status instead of deleting the record
      console.log(user);
      user.set({
        isDisabled: true,
        dateModified: new Date(),
      });

      // save function to update user object
      user.save(function (err, savedUser) {

        // Server error if unable to save the disabled status
        if (err) {
          console.log(err);
          const userError = new ErrorResponse(
            500, "Bad request, unable to update record", err);
          res.json(500).send(userError.toObject());
          serverError();
          return;
        }

        // Successfully saves the disabled status
        console.log(savedUser);
        const userResponse = new BaseResponse(
          204, "Successful Query", savedUser);
        res.json(userResponse.toObject());
        successResponse(savedUser);
      });
    });

    // Server error
  } catch (e) {
    console.log(e);
    const userError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(userError.toObject());
    serverError();
  }
});


/**
 * FindSelectedSecurityQuestions
 * @openapi
 * /api/users/{hubId}/security-questions:
 *   get:
 *     tags:
 *       - Users
 *     description: API that finds security questions by hubId
 *     summary:  Finds Selected Security Questions by hubId
 *     parameters:
 *        - name: hubId
 *          in: path
 *          required: true
 *          description: hubId
 *          schema:
 *            type: string
 *     responses:
 *       '200':
 *         description: Query successful
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null Record
 *       '500':
 *         description: Server Exception
 */

// FindSelectedSecurityQuestions
router.get("/:hubId/security-questions", async (req, res) => {
  try {

    // findOne function to find user by hubId
    User.findOne({ hubId: req.params.hubId }, function (err, user) {

      // 404 error if user not found
      if (err) {
        console.log(err);
        const userError =
          new ErrorResponse(404, "Bad request, invalid path.", err);
        res.status(404).send(userError.toObject());
          requestError();
        return
      }

      // Successful Query
      console.log(user);
      const userResponse = new BaseResponse(
        204, "Query Successful", user.selectedSecurityQuestions);
      res.json(userResponse.toObject());
      successResponse(user);
    });

  // Server Error
  } catch (e) {
    console.log(e);
    const userError = new ErrorResponse(
      500, "Internal server error", e);
    res.status(500).send(userError.toObject());
    serverError();
  }
});


/**
 * findUserRole
 * @openapi
 * /api/users/{hubId}/role:
 *   get:
 *     tags:
 *       - Users
 *     description: API that finds role by hubId
 *     summary:  Finds role by hubId
 *     parameters:
 *        - name: hubId
 *          in: path
 *          required: true
 *          description: hubId
 *          schema:
 *            type: string
 *     responses:
 *       '200':
 *         description: Query successful
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server Exception
 */

//findUserRole
router.get('/:hubId/role', async (req, res) => {
  try {

    // findOne function to find user by hubId
    User.findOne({'hubId': req.params.hubId}, function(err, user) {

      // If hubId not found
      if (err) {
        console.log(err);
        const userError = new ErrorResponse(
          404, 'Bad request, hubId not found', err);
        res.status(404).send(userError.toObject());
        requestError();
        return
      }

      // if user found, return user role
      console.log(user);
      const userResponse = new BaseResponse(200, 'Query successful', user.role);
      res.json(userResponse.toObject());
      successResponse(user);
    })

    // Server error
  } catch (e) {
    console.log(e);
    const userError = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(userError.toObject());
    serverError();
  }
})


module.exports = router;
