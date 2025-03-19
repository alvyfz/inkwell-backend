import mongoose from 'mongoose'

const Schema = mongoose.Schema

const topicSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['topic', 'subtopic'],
      default: 'topic'
    },
    parentId: {
      type: String
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const Topic = mongoose.models.topics || mongoose.model('topics', topicSchema)

export default Topic
