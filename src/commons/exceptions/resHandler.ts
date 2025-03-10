import ClientError from './ClientError'

export const resErrorHandler = (res: any, error: any) => {
  if (error.code === 'ECONNREFUSED') {
    console.log(error)
    return res.status(500).json({
      status: false,
      message: 'service unavailable',
      dev: error.message,
      code: 500
    })
  }

  if (error instanceof ClientError) {
    const response = {
      isSuccess: false,
      message: error.message,
      error: error.errors,
      code: error.statusCode || 400
    }
    return res.status(error.statusCode || 400).json(response)
  }

  if (error.response) {
    const response = {
      isSuccess: false,
      message: error.response.message,
      error: error.response.code,
      code: error.response.code || 500
    }
    return res.status(error.response.code || 500).json(response)
  }

  // Server ERROR!
  console.log(error, 'error')
  console.log(error.messag, 'error message')
  const response = {
    isSuccess: false,
    message: 'Sorry, something went wrong on the server',
    dev: error.message,
    code: 500
  }
  return res.status(500).json(response)
}

export const resSuccessHandler = (res: any, message: any, payload?: any, code = 200) => {
  const response = {
    isSuccess: true,
    payload,
    message,
    code
  }
  return res.status(code).send(response)
}
