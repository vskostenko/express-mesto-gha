const http2 = require('http2');

class AnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = http2.constants.HTTP_STATUS_UNAUTHORIZED;
  }
}

module.exports = AnauthorizedError;
