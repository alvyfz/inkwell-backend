import ClientError from '@/commons/exceptions/ClientError'
import { resSuccessHandler } from '@/commons/exceptions/resHandler'
import checkRequiredFields from '@/commons/utils/checkRequiredFields'
import { IGetListParams } from '@/commons/utils/types'
import { ITopic } from '@/entities/topicEntities'
import { createTopic, getListTopic } from '@/repository/topicCollection'
import { NextFunction, Request, Response } from 'express'

export const createTopicController = async (req: Request, res: Response, next: NextFunction) => {
  const body: ITopic = req.body as ITopic

  try {
    checkRequiredFields(body, ['name', 'type'])

    const topic = await createTopic({ name: body.name, type: body.type, parentId: body.parentId })

    resSuccessHandler(res, 'New topic created.', topic)
  } catch (error) {
    next(error)
  }
}

export const getListTopicController = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query

  const search = query.search || ''
  const sort = query.sort || 'desc'
  const size = query.size || undefined
  const page = query.page || 1

  try {
    const topics = await getListTopic({ search, sort, size, page } as IGetListParams)

    if (!topics.length) {
      throw new ClientError('Topics not found.', 404)
    }

    resSuccessHandler(res, 'Success', topics)
  } catch (error) {
    next(error)
  }
}
