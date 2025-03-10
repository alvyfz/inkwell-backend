import mongoose from 'mongoose'

const Schema = mongoose.Schema

const articleTagSchema = new Schema(
  {
    articleId: {
      type: String,
      required: true
    },
    tagId: {
      type: String,
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const ArticleTag = mongoose.models.articleTags || mongoose.model('articleTags', articleTagSchema)

export default ArticleTag
