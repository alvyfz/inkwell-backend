export interface IUser {
  email: string
  password?: string
  name?: string
  isVerified?: boolean
  bio?: string
  avatar?: string
  cover?: string
  isAdmin?: boolean
  verifyOtp?: string
  verifyOtpExpiry?: Date
  createdAt?: Date
  updatedAt?: Date
}
