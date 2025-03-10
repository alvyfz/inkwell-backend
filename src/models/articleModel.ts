import mongoose from 'mongoose'

const Schema = mongoose.Schema

const articleSchema = new Schema(
  {
    authorId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    tagIds: {
      type: [String]
    },
    coverImage: String,
    publishedDate: Date,
    status: {
      type: String,
      enum: ['draft', 'unpublished', 'published'],
      default: 'draft'
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

const Article = mongoose.models.articles || mongoose.model('articles', articleSchema)

export default Article
