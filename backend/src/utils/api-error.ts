class ApiError extends Error {
  errorCode: number

  constructor(errorCode: number, message: string | any) {
    super()
    this.errorCode = errorCode
    this.message = message
  }
}

export default ApiError
