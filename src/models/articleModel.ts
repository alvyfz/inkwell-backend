import mongoose from 'mongoose'

const Schema = mongoose.Schema

const articleSchema = new Schema(
  {
    authorId: {
      type: String,
      required: true
    },
    title: {
      type: String
    },
    content: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    coverImage: String,
    publishedDate: Date,
    status: {
      type: String,
      enum: ['draft', 'unpublished', 'published'],
      default: 'draft'
    },
    like: {
      type: Number,
      default: 0
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

const Article = mongoose.models.articles || mongoose.model('articles', articleSchema)

export default Article
