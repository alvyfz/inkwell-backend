import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema(
  {
    articleId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    replyTo: {
      type: String
    },
    likes: {
      type: [String]
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const Comment = mongoose.models.comments || mongoose.model('comments', commentSchema)

export default Comment
