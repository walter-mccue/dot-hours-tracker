/**
 * Title: security-question.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Schema to define the security-questions collection
*/

// Require statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining security schema
let SecurityQuestionSchema = new Schema(
  {
    text: { type: String },
    isDisabled: { type: Boolean, default: false },
  },
  { collection: "security" }
);

module.exports = mongoose.model("SecurityQuestion", SecurityQuestionSchema);
