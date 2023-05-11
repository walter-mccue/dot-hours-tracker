/**
 * Title: selected-security-question.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Schema to define the user's role
*/

// Require statements
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define user role schema
let userRoleSchema = new Schema({
  text: {type: String, default: 'standard'}
})

module.exports = userRoleSchema;
