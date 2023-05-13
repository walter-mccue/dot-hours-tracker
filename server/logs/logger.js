/**
 * Title: logger.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Logging script to direct log commands to the appropriate log file.
*/

// Require statements
const { appendFileSync } =require('fs');
const { join } = require('path');

// Directory for logging
const debugLog = join(__dirname, 'debug.log')
const errorLog = join(__dirname, 'error.log')

// Function to collect date/time
const getDateTime = () => {
  const now = new Date()
  return now.toLocaleString('en-US')
}

// Successful operations are logged to the debug.log
module.exports.debugLogger = (data) => {
  const logString = `[${getDateTime()}] server\t ${data.filename} - ${data.message} - ${data.item}\n`
  appendFileSync(debugLog, logString)
}

// Errors are logged to the error.log
module.exports.errorLogger = (data) => {
  const logString = `[${getDateTime()}] server\t ${data.filename} - ${data.message} - ${data.item}\n`
  appendFileSync(errorLog, logString)
}
