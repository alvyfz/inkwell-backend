import { NextFunction, Request, Response } from 'express'
import {
  getUserByUsername,
  getUserDetail
} from '../repository/userCollection'
import ClientError from '../commons/exceptions/ClientError'
import { resSuccessHandler } from '../commons/exceptions/resHandler'
import { isEmpty } from 'lodash'

// OAuth-only authentication - traditional email/password authentication removed

export const userDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserDetail(res.locals.user.id)

    resSuccessHandler(res, 'Success.', user)
  } catch (error) {
    next(error)
  }
}



export const usernameValidationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.query

  try {
    if (isEmpty(username)) {
      throw new ClientError('username is required.', 400)
    }

    const user = await getUserByUsername(username as string)

    if (!!user) {
      throw new ClientError('Username already exists.', 400)
    }

    resSuccessHandler(res, 'Success.')
  } catch (error) {
    next(error)
  }
}
