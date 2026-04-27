class ClientError extends Error {
  statusCode: number
  errors: any
  constructor(message: any, statusCode = 400, errors?: any) {
    super(message)
    this.statusCode = statusCode
    this.name = 'ClientError'
    this.errors = errors
  }
}

export default ClientError
