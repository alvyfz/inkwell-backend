import mongoose from 'mongoose'

const Schema = mongoose.Schema

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['tag', 'subtag'],
      default: 'tag'
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

const Tag = mongoose.models.tags || mongoose.model('tags', tagSchema)

export default Tag
