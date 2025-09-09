import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    name: String,
    isVerified: {
      type: Boolean,
      default: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    bio: String,
    avatar: String,
    cover: String,
    isAdmin: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    authType: {
      type: String,
      enum: ['oauth'],
      default: 'oauth'
    },
    oauthProviders: [{
      provider: {
        type: String,
        enum: ['github', 'google']
      },
      providerId: String,
      email: String,
      accessToken: String,
      refreshToken: String
    }]
  },
  { timestamps: true }
)

const User = mongoose.models.users || mongoose.model('users', userSchema)

export default User
