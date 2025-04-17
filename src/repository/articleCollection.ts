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

export const deleteArticle = async (userId: string, articleId: string) =>
  Article.deleteOne({ _id: articleId, authorId: userId })

export const getArticleById = async (articleId: string) =>
  Article.findById(articleId).select('-__v')

export const getMyArticleById = async (userId: string, articleId: string) =>
  Article.findOne({ _id: articleId, authorId: userId }).select('-__v')
