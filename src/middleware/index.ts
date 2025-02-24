// import { app } from '../config/firebaseConfig'
import AuthenticationError from '../commons/exceptions/AuthenticationError'
import { Request, Response, NextFunction } from 'express'
import { auth } from 'firebase-admin'

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const idToken = req.headers.authorization?.split('Bearer ')[1]

  try {
    if (!idToken) {
      throw new AuthenticationError('Unauthorized: No token provided')
    }

    const decodedToken = await auth( ).verifyIdToken(idToken)

    if (!decodedToken) {
      throw new AuthenticationError('Unauthorized: Invalid token')
    }

    res.locals.user = decodedToken

    next()
  } catch (error: any) {
    if (error.code === 'auth/id-token-expired') {
      next(new AuthenticationError('Unauthorized: Token has expired'))
    } else {
      next(new AuthenticationError('Unauthorized: Invalid token'))
    }
  }
}
