import mongoose from 'mongoose'

const Schema = mongoose.Schema

const bookmarkSchema = new Schema(
  {
    articleId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    createAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const Bookmark = mongoose.models.bookmarks || mongoose.model('bookmarks', bookmarkSchema)

export default Bookmark
