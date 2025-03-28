import { NextFunction, Request, Response } from 'express'
import ClientError from '../commons/exceptions/ClientError'
import { resSuccessHandler } from '../commons/exceptions/resHandler'
import { isEmpty } from 'lodash'
import { getFile, uploadFile } from '../repository/fileCollection'
const fs = require('fs/promises')
const { InputFile } = require('node-appwrite/file')

interface MulterRequest extends Request {
  file: any
}

export const uploadFileController = async (req: Request, res: Response, next: NextFunction) => {
  const file = (req as MulterRequest).file

  try {
    if (isEmpty(file)) {
      throw new ClientError('No files reveived.', 400)
    }
    const fileInput = InputFile.fromPath(file.path, file.originalname)

    const upload = await uploadFile(fileInput)

    try {
      await fs.unlink(file.path)
    } catch (e) {
      console.log(e)
    }

    resSuccessHandler(res, 'Successfully uploaded file.', upload.$id)
  } catch (error) {
    next(error)
  }
}

export const getFileController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query

  try {
    if (isEmpty(id)) {
      throw new ClientError('id cannot empty.', 400)
    }

    const file = await getFile(id as string)

    if (!file) {
      throw new ClientError('File not found.', 404)
    }

    resSuccessHandler(res, 'Success', file)
  } catch (error) {
    next(error)
  }
}
