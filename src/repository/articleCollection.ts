import * as dotenv from 'dotenv'
import { connect } from '../config/mongo'
import Article from '../models/articleModel'

dotenv.config()

connect()

export const getDrafArticle = async (userId: string) =>
  Article.findOne({ authorId: userId, status: 'draft' }).select('-__v')

export const createDraftArticle = async (userId: string, title: string, content: string) =>
  new Article({ authorId: userId, title, content }).save()
