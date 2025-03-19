import mongoose from 'mongoose'

const Schema = mongoose.Schema

const articleTopicSchema = new Schema(
  {
    articleId: {
      type: String,
      required: true
    },
    topicId: {
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

const ArticleTopic =
  mongoose.models.articleTopics || mongoose.model('articleTopics', articleTopicSchema)

export default ArticleTopic
