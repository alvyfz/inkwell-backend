import { NextFunction, Request, Response } from 'express'
import {createUserCollection} from '../repository/userCollection'
import { User } from '../entities/user'
import { resSuccessHandler } from '../commons/exceptions/resHandler'
import ClientError from "../commons/exceptions/ClientError";
import { isEmpty } from 'lodash'


  export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
    const userData: Partial<User> = req.body
      if(isEmpty(userData.email) || isEmpty(userData.password) || isEmpty(userData.name)){
        next(new ClientError('Please provide all the required fields.'))
      }

      try {
        await createUserCollection({email: userData.email, password: userData.password, name: userData.name})
        resSuccessHandler(res, 'Signup successfully. Please login to continue.')
      } catch (error) {
        next(error)
      }
}
