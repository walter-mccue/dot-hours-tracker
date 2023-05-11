/**
 * Title: role.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Schema to define the roles collection
*/

// Require statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining security schema
let RoleSchema = new Schema(
  {
    text: { type: String },
    isDisabled: { type: Boolean, default: false },
  },
  { collection: "roles" }
);

module.exports = mongoose.model("Role", RoleSchema);
