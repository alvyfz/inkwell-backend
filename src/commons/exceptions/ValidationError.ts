const ClientError = require('./ClientError')

class ValidationError extends ClientError {
  constructor(message: any, errors: any) {
    super(message, 400, errors)
    this.name = 'ValidationError'
  }
}

module.exports = ValidationError
