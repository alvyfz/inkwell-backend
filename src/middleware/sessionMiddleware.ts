import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/authService'
import AuthorizationError from '../utils/AuthorizationError'

export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getCurrentUser()
    if (!user) {
      throw new AuthorizationError('Authentication required.')
    }
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
