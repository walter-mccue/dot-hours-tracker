/**
 * Title: base-response.js
 * Author: Walter McCue
 * Date: 05/10/23
 * Description: Queries with a successful response from server
 * References: See references.log: line 1
*/


// Allows us to store server responses
class BaseResponse {
  constructor (httpCode, message, data) {
    this.httpCode = httpCode;
    this.message = message;
    this.data = data;
  }
  toObject () {
    return {
      httpCode: this.httpCode,
      message: this.message,
      data: this.data,
      timestamp: new Date().toLocaleString('en-US')
    }
  }
}

module.exports = BaseResponse;
