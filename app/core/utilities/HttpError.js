'use strict';

module.exports = function HttpError(message, errorCode) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.errorCode = errorCode;
};

require('util').inherits(module.exports, Error);