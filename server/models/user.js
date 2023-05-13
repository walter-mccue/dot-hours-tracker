/**
 * Title: user.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Schema to define the user collection
 * References: See references.log: line 1
*/

// Require Statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userRoleSchema = require("../schemas/user-role");
const selectedSecurityQuestionSchema = require("../schemas/selected-security-question");

// Defining user schema
let userSchema = new Schema(
  {
    hubId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    isDisabled: { type: Boolean, default: false },
    role: userRoleSchema,
    selectedSecurityQuestions: [selectedSecurityQuestionSchema],
    dateCreated: { type: Date, default: new Date() },
    dateModified: { type: Date },
  },
  { collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
