const { Error } = require("mongoose");

class ApplicationError extends Error {
  constructor ( status = 500, message="Internal error") {
    super ();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;
  }
}

class UserNotFound extends ApplicationError {
  constructor(){
    super(404,"User not found");
  }
}

module.exports.errorHandler = (err,res) => {

}