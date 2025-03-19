import { NextFunction, Request, Response } from 'express'

import ClientError from '@/commons/exceptions/ClientError'
import { resSuccessHandler } from '@/commons/exceptions/resHandler'
import * as dotenv from 'dotenv'
import { isEmpty } from 'lodash'
import { createDraftArticle, getDrafArticle } from '@/repository/articleCollection'
import { IArticle } from '@/entities/articleEntities'
import checkRequiredFields from '@/commons/utils/checkRequiredFields'
import { updateArticleTopic } from '@/repository/topicCollection'

dotenv.config()

export const draftUpdateController = async (req: Request, res: Response, next: NextFunction) => {
  const { title, content }: { title: string; content: string } = req.body
  try {
    if (isEmpty(title) || isEmpty(title)) {
      throw new ClientError('title or content cannot empty.', 400)
    }

    const draftExist = await getDrafArticle(res.locals.user.id)

    if (!draftExist) {
      const draftNew = await createDraftArticle(res.locals.user.id, title, content)
      resSuccessHandler(res, 'Draft created.', draftNew)
    } else {
      draftExist.title = title
      draftExist.content = content

      await draftExist.save()
      resSuccessHandler(res, 'Draft updated.', draftExist as IArticle)
    }
  } catch (error) {
    next(error)
  }
}

export const getDraftController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const draftExist = await getDrafArticle(res.locals.user.id)

    if (!draftExist) {
      throw new ClientError('Draft not found.', 404)
    }

    resSuccessHandler(res, 'Success', draftExist)
  } catch (error) {
    next(error)
  }
}

export const publishDraftController = async (req: Request, res: Response, next: NextFunction) => {
  const reqBody = req.body
  const { topicIds, coverImage }: { topicIds: string[]; coverImage: string } = reqBody

  try {
    checkRequiredFields(reqBody, ['topicIds', 'coverImage'])
    const draftExist = await getDrafArticle(res.locals.user.id)

    if (!draftExist) {
      throw new ClientError('Draft not found.', 404)
    }

    draftExist.status = 'published'
    draftExist.coverImage = coverImage
    await Promise.all([updateArticleTopic(topicIds, draftExist._id), draftExist.save()])

    resSuccessHandler(res, 'Story published.', draftExist)
  } catch (error) {
    next(error)
  }
}
