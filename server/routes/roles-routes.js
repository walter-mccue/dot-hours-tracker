/**
 * Title: roles-routes.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Role APIs
*/


/**
 * API: http://localhost:3000/api/roles
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

// Validation
const ajv = new Ajv();

// Schema for validation
const roleSchema = {
  type: 'object',
  properties: {
    text: {type: 'string'}
  },
  required: ['text'],
  additionalProperties: false
}

// Logging
const myFile = "roles-routes.js";

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
 * findAllRoles
 * @openapi
 * /api/roles/:
 *   get:
 *     tags:
 *       - Roles
 *     description:  API for viewing User roles
 *     summary: view user roles
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: server error for all other use cases
 */

// findAllRoles
router.get("/", async (req, res) => {
  try {

    // find function to find all Role objects where the isDisabled field is set to false
    Role.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (err, roles) {

        // Server error
        if (err) {
          console.log(err);
          const roleError = new ErrorResponse(
            400, "Bad request, path invalid", err);
          res.status(400).send(roleError.toObject());
          requestError();
          return
        }

        // Successful Query
        console.log(roles);
        const roleResponse = new BaseResponse(
          200, "Query successful", roles);
        res.json(roleResponse.toObject());
        successResponse(roles);
      }
    );

  // Server error
  } catch (e) {
    console.log(e);
    const roleError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(roleError.toObject());
    serverError();
  }
});


/**
 * findRoleById
 * @openapi
 * /api/roles/{roleId}/:
 *   get:
 *     tags:
 *       - Roles
 *     description: API that finds role by ID
 *     summary: Finds role by ID
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: success
 *       '404':
 *         description: Bad Request
 *       '500':
 *         description: Server Error
 */

// findRolesById
router.get("/:roleId", async (req, res) => {
  try {

    // findOne function to find Role by _id
    Role.findOne({ _id: req.params.roleId }, function (err, role) {

      // 404 Error if _id not found
      if (role === null) {
        console.log(err);
        const roleError = new ErrorResponse(
          404, "Bad request, _id not found", err);
        res.status(404).send(roleError.toObject());
        requestError();
        return
      }

      // Successful query
      console.log(role);
      const roleResponse = new BaseResponse(
        200, "Query successful", role);
      res.json(roleResponse.toObject());
      successResponse(role);
    });

  // Server error
  } catch (e) {
    console.log(e);
    const roleError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(roleError.toObject());
    serverError();
  }
});


/**
 * createRole
 * @openapi
 * /api/roles:
 *   post:
 *     tags:
 *       - Roles
 *     description: API that creates a new user role
 *     summary: Creates a new user role.
 *     requestBody:
 *       description: Role data
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
 *         description: Role successfully created
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Duplicate request
 *       '404':
 *         description: Null record
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

// createRole
router.post("/", async (req, res) => {
  try {

    let newRole = req.body

    // Checks current request body against the schema
    const validator = ajv.compile(roleSchema);
    const valid = validator(newRole)

    if (!valid) {
      console.log('Bad Request, unable to validate');
      const roleError = new ErrorResponse(
        400, 'Bad Request, unable to validate', newRole);
      res.status(400).send(roleError.toObject());
      validError();
      return
    }

    // findOne function to find a Role by text value
    Role.findOne({ text: req.body.text }, (err, role) => {

      // If not found
      if (err) {
        console.log(err);
        const roleError = new ErrorResponse(
          404, "Bad Request, role path not found", err);
        res.status(404).send(roleError.toObject());
        requestError();
        return
      }

      console.log(role);

      // If the role does not already exist
      if (role) {

        // Error if role already exists
        console.log(`Role: ${req.body.text} already exists`);
        const roleError = new ErrorResponse(
          401, `Role: ${req.body.text} already exists.`, role);
        res.status(401).send(roleError.toObject());
        errorLogger({
          filename: myFile, message: "Role already exists"});
        return
      }

      const newRole = { text: req.body.text };

      // create function to create a new Role
      Role.create(newRole, (err, role) => {

        // Server error
        if (err) {
          console.log(err);
          const roleError = new ErrorResponse(
            500, "Server error", err);
          res.status(500).send(roleError.toObject());
          serverError();
          return
        }

        // Successful query
        console.log(role);
        const roleResponse = new BaseResponse(
          200, "Query successful", role);
        res.json(roleResponse.toObject());
        successResponse(role);
      });
    });

  // Server error
  } catch (e) {
    console.log(e);
    const roleError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(roleError.toObject());
    serverError();
  }
});


/**
 * updateRole
 * @openapi
 * /api/roles/{roleId}/:
 *   put:
 *     tags:
 *       - Roles
 *     description: API that updates the user role
 *     summary: updates user role
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Role data
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
 *         description: Role updated
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Server Exception
 */

// updateRole
router.put("/:roleId", async (req, res) => {
  try {

    let updateRole = req.body;

    // Checks current request body against the schema
    const validator = ajv.compile(roleSchema);
    const valid = validator(updateRole);

    // If invalid return 400 Error
    if (!valid) {
      console.log('Bad Request, unable to validate');
      const roleError = new ErrorResponse(
        400, 'Bad Request, unable to validate', valid);
      res.status(400).send(roleError.toObject());
      validError();
      return
    }

    // findOne function to find role by _id
    Role.findOne({ _id: req.params.roleId }, (err, role) => {

      // 404 error if _id not found
      if (role === null) {
        console.log(err);
        const roleError = new ErrorResponse(
          404, "Bad request, _id not found", err);
        res.status(404).send(roleError.toObject());
        requestError();
          return
      }
      console.log(role);
      role.set({ text: req.body.text });
      role.save((err, updateRole) => {

        // Server error
        if (err) {
          console.log(err);
          const roleError = new ErrorResponse(
            500, "Server error", err);
          res.status(500).send(roleError.toObject());
          serverError();
          return
        }

        // Successful query
        console.log(updateRole);
        const roleResponse = new BaseResponse(
          204, "Query successful", updateRole);
        res.json(roleResponse.toObject());
        successResponse(updateRole);
      });
    });

  // Server error
  } catch (e) {
    console.log(e);
    const roleError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(roleError.toObject());
    serverError();
  }
});


/**
 * deleteRole
 * @openapi
 * /api/roles/{roleId}/:
 *   delete:
 *     tags:
 *       - Roles
 *     description: API that delete the user role
 *     summary: Deletes user role
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Role Deleted
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Server Error
 */

// deleteRole
router.delete("/:roleId", async (req, res) => {
  try {

    // findOne function to find a role by _id
    Role.findOne({ _id: req.params.roleId }, function (err, role) {

      // If _id is not found
      if (role === null) {
        console.log(err);
        const roleError = new ErrorResponse(
          404, "Bad request, role not found", err);
        res.status(404).send(roleError.toObject());
        requestError();
        return;
      }

      // If Role is found
      console.log(role);

      // Searches users for roles that match the currently requested role
      User.aggregate(
        [
          {
            $lookup: {
              from: "roles",
              localField: "role.text",
              foreignField: "text",
              as: "userRoles",
            },
          },
          {
            $match: {
              "userRoles.text": role.text,
            },
          },
        ],
        function (err, users) {
          console.log(users);

          // Server error
          if (err) {
            console.log(err);
            const roleError = new ErrorResponse(
              500, "Internal server error", err);
            res.status(500).send(roleError.toObject());
            serverError();
            return;
          }

          // If users have the role, returns an error
          if (users.length > 0) {
            console.log(
              `Role ${role.text} is already in use and cannot be deleted.`);
            const roleError = new ErrorResponse(
              501, `Role ${role.text} is already in use and cannot be deleted.`, role);
            res.status(501).send(roleError.toObject());
            errorLogger({
              filename: myFile,
              message: `Role <${role.text}> is already in use and cannot be deleted.`});
            return
          }

          // If no users have the role, confirms that the role can be deleted
          console.log(
            `Role <${role.text}> is not in use and can be safely removed.`);
          role.set({ isDisabled: true });
          role.save(function (err, updatedRole) {

            // Internal server error
            if (err) {
              const roleError = new ErrorResponse(
                500, "Internal server error", err);
              res.status(500).send(roleError.toObject());
              serverError();
              return;
            }

            // Successful Query
            console.log(updatedRole);
            const roleResponse = new BaseResponse(
              204,
              `Role ${role.text} has been removed successfully.`,
              updatedRole
            );
            res.json(roleResponse.toObject());
            successResponse(updatedRole);
          });
        }
      );
    });

  // Internal server error
  } catch (e) {
    const roleError = new ErrorResponse(
      500, "Internal server error", e.message);
    res.status(500).send(roleError.toObject());
    serverError();
  }
});


module.exports = router;
