import * as dotenv from 'dotenv'
import { connect } from '../config/mongo'
import Article from '../models/articleModel'

dotenv.config()

connect()

export const getDraftArticle = async (userId: string) =>
  Article.findOne({ authorId: userId, status: 'draft' }).select('-__v')

export const createDraftArticle = async (userId: string, content: string) =>
  new Article({ authorId: userId, content }).save()

export const getListMyArticle = async (userId: string, status: string) =>
  Article.find({ authorId: userId, status })
    .sort({ updatedAt: -1 })
    .select('-__v')
    .populate('authorId', 'name avatar')
    .lean()
