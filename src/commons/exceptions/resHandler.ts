import ClientError from './ClientError'

export const resErrorHandler = (res: any, error: any) => {
  if (error.code === 'ECONNREFUSED') {
    console.log(error)
    return res.status(500).json({
      status: false,
      message: 'service unavailable',
      dev: error.message
    })
  }

  if (error instanceof ClientError) {
    const response = {
      isSuccess: false,
      message: error.message,
      error: error.errors
    }
    return res.status(error.statusCode || 400).json(response)
  }

  if (error.response) {
     const response = {
      isSuccess: false,
      message: error.response.message,
      error: error.response.type,
       code: error.response.code
    }
    return res.status(error.response.code || 500).json(response)
  }

  // Server ERROR!
  console.log(error)
  console.log(error.message)
  const response = {
    isSuccess: false,
    message: 'Sorry, something went wrong on the server',
    dev: error
  }
  return res.status(500).json(response)
}

export const resSuccessHandler = (res: any, message: any, payload?: any, code = 200) => {
  const response = {
    isSuccess: true,
    payload,
    message
  }
  return res.status(code).send(response)
}
