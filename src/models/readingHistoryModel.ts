import mongoose from 'mongoose'

const Schema = mongoose.Schema

const readingHistorySchema = new Schema(
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

const ReadingHistory =
  mongoose.models.readingHistories || mongoose.model('readingHistories', readingHistorySchema)

export default ReadingHistory
