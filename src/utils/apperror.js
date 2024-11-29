/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */

class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = (`${statusCode}.startsWith('4') ? 'fail' : 'error'`);
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
   }
   
   module.exports = AppError;
   