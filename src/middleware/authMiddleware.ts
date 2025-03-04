import AuthenticationError from '../commons/exceptions/AuthenticationError'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { isEmpty } from 'lodash'

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1]

    if (isEmpty(token)) {
      throw new AuthenticationError('Unauthorized: No token provided.')
    }

    const decodedToken = jwt.verify(token as string, process.env.SECRET_TOKEN as string)

    if (isEmpty(decodedToken)) {
      throw new AuthenticationError('Unauthorized: Invalid token.')
    }

    res.locals.user = decodedToken

    next()
  } catch (error: any) {
    next(error)
  }
}
