import AuthenticationError from '../commons/exceptions/AuthenticationError'
import { Request, Response, NextFunction } from 'express'
import { isEmpty } from 'lodash'
import { decryptAES } from '@/commons/utils/cryptoAes'

const keyMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const apiKey = req.headers?.['api-key']

    if (!isEmpty(apiKey)) {
      const decodedKey = JSON.parse(decryptAES(apiKey as string) || '{}')
      if (decodedKey.key === process.env.SECRET_TOKEN && decodedKey.expiry > Date.now()) {
        next()
      } else {
        throw new AuthenticationError('Unauthorized: Invalid api key.')
      }
    } else {
      throw new AuthenticationError('Unauthorized: No api key provided.')
    }
  } catch (err) {
    next(err)
  }
}

export default keyMiddleware
