import mongoose from 'mongoose'

const Schema = mongoose.Schema

const likeSchema = new Schema(
  {
    likeeId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['user', 'topic', 'article'],
      default: 'article'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const Like = mongoose.models.likes || mongoose.model('likes', likeSchema)

export default Like
