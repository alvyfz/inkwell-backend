import { NextFunction, Request, Response } from 'express'

import ClientError from '../commons/exceptions/ClientError'
import { resSuccessHandler } from '../commons/exceptions/resHandler'
import * as dotenv from 'dotenv'
import { isEmpty } from 'lodash'
import {
  createDraftArticle,
  deleteArticle,
  getDraftArticle,
  getListMyArticle,
  getMyArticleById
} from '../repository/articleCollection'
import { IArticle } from '../entities/articleEntities'
import checkRequiredFields from '../commons/utils/checkRequiredFields'
import { updateArticleTopic } from '../repository/topicCollection'

dotenv.config()

export const draftUpdateController = async (req: Request, res: Response, next: NextFunction) => {
  const { content }: { title: string; content: string } = req.body
  try {
    if (isEmpty(content)) {
      throw new ClientError('title cannot empty.', 400)
    }

    const draftExist = await getDraftArticle(res.locals.user.id)

    if (!draftExist) {
      const draftNew = await createDraftArticle(res.locals.user.id, content)
      resSuccessHandler(res, 'Draft created.', draftNew)
    } else {
      draftExist.content = content
      draftExist.updatedAt = new Date()

      await draftExist.save()
      resSuccessHandler(res, 'Draft updated.', draftExist as IArticle)
    }
  } catch (error) {
    next(error)
  }
}

export const getDraftController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const draftExist = await getDraftArticle(res.locals.user.id)

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
  const {
    topicIds,
    coverImage,
    title,
    description,
    status
  }: {
    topicIds: string[]
    coverImage: string
    title: string
    description: string
    status: 'published' | 'unpublished'
  } = reqBody

  try {
    checkRequiredFields(reqBody, ['topicIds', 'coverImage', 'title', 'description', 'status'])

    if (!['published', 'unpublished'].includes(status)) {
      throw new ClientError('Invalid status.', 400)
    }
    const draftExist = await getDraftArticle(res.locals.user.id)

    if (!draftExist) {
      throw new ClientError('Draft not found.', 404)
    }

    draftExist.status = status
    draftExist.coverImage = coverImage
    draftExist.title = title
    draftExist.description = description
    await Promise.all([updateArticleTopic(topicIds, draftExist._id), draftExist.save()])

    resSuccessHandler(res, 'Story published.', draftExist)
  } catch (error) {
    next(error)
  }
}

export const getListMyArticleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req
  try {
    const { status } = req.query

    if (!['published', 'unpublished'].includes(status as string)) {
      throw new ClientError('Invalid status.', 400)
    }

    const draftList = await getListMyArticle(res.locals.user.id, status as string)

    if (!draftList.length) {
      throw new ClientError('Draft not found.', 404)
    }

    resSuccessHandler(res, 'Success', draftList)
  } catch (error) {
    next(error)
  }
}

export const deleteMyArticleByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req
  try {
    const { id } = req.params

    checkRequiredFields({ id }, ['id'])

    const deleteMyArticle = await deleteArticle(res.locals.user.id, id)

    resSuccessHandler(res, 'Success delete article.', deleteMyArticle)
  } catch (error) {
    next(error)
  }
}

export const unpublishArticleByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req
  try {
    const { id } = req.params

    checkRequiredFields({ id }, ['id'])

    const myArticle = await getMyArticleById(res.locals.user.id, id)

    if (!myArticle) {
      throw new ClientError('Article not found.', 404)
    }

    if (myArticle.status === 'unpublished' || myArticle.status === 'draft') {
      throw new ClientError('Article already unpublished.', 400)
    }

    myArticle.status = 'unpublished'
    myArticle.updatedAt = new Date()
    await myArticle.save()

    resSuccessHandler(res, 'Success unpublished article.')
  } catch (error) {
    next(error)
  }
}
