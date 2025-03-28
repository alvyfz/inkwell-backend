import { isEmpty } from 'lodash'
import { ITopic } from './../entities/topicEntities'

import { connect } from '../config/mongo'
import Topic from '../models/topicModel'
import { IGetListParams } from '../commons/utils/types'
import ArticleTopic from '../models/articleTopicModel'

connect()

export const createTopic = async ({ name, type, parentId }: ITopic) => {
  return new Topic({ name, type, parentId }).save()
}

export const getListTopic = async ({ search, sort, size, page }: IGetListParams) => {
  const skip = (size ?? 0) * (page - 1)

  const query = {
    $or: [{ name: { $regex: search, $options: 'i' } }]
  }
  const req = Topic.find(query)
  req.sort({ name: sort })

  if (!isEmpty(size)) {
    req.limit(size ?? 0)
    req.skip(skip)
  }

  return req
}

export const updateArticleTopic = async (topicIds: string[], articleId: string) => {
  const topics = topicIds.map((v) => ({
    topicId: v,
    articleId
  }))
  await ArticleTopic.deleteMany({ articleId })
  return ArticleTopic.insertMany(topics)
}
