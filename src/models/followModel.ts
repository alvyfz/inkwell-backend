import mongoose from 'mongoose'

const Schema = mongoose.Schema

const followSchema = new Schema(
  {
    followeeId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['user', 'topic'],
      default: 'user'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const Follow = mongoose.models.follows || mongoose.model('follows', followSchema)

export default Follow
