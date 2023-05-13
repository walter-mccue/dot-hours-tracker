/**
 * Title: selected-security-question.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Schema to define the user's selected security question
 * References: See references.log: line 1
*/

// Require statements
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define selected security questions schema
let selectedSecurityQuestionSchema = new Schema({
  questionText: { type: String },
  answerText: { type: String }
})

module.exports = selectedSecurityQuestionSchema;
