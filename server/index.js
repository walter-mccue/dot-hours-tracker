/**
 * Title: index.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Server connections to the database and routes for the API queries
 * References: See references.log: line 1
*/

// Require statements
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const createError = require("http-errors");
const dotenv = require("dotenv");
const UsersRoute = require("./routes/users-routes");
const RolesRoute = require("./routes/roles-routes");
const SecurityRoute = require("./routes/security-routes");
const Session = require("./routes/session-routes");
const HoursRoute = require("./routes/hours-routes");

const app = express(); // Express variable.

dotenv.config(); // dotenv config function

mongoose.set('strictQuery', false); // Removes depreciation warning in console


// App configurations.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/dot-hours-tracker")));
app.use("/", express.static(path.join(__dirname, "../dist/dot-hours-tracker")));

// Default server port value.
const PORT = process.env.PORT || 3000;

// MongoDB connection string.
const CONN = process.env.MONGO_CONN

// Database Connection
mongoose
  .connect(CONN)
  .then(() => {
    console.log("Connection to the database was successful");
  })
  .catch((err) => {
    console.log("MongoDB Error: " + err.message);
  });


// Tells the server which route to use
app.use("/api/users", UsersRoute);
app.use("/api/security", SecurityRoute);
app.use("/api/roles", RolesRoute);
app.use("/api/session", Session);
app.use("/api/hours-tracker", HoursRoute);

// Error handler for 404 errors
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler for other errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    type: "error",
    status: err.status,
    message: err.message,
    stack: req.app.get("env") === "development" ? err.stack : undefined,
  });
});

// Wire-up the Express server.
app.listen(PORT, () => {
  console.log("Application started and listening on PORT: " + PORT);
});
