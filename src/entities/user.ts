export interface User {
  _id?: string
  name?: string
  email: string
  password?: string
  isVerified?: boolean
  forgotPasswordToken?: string
  forgotPasswordTokenExpiry?: Date
  verifyToken?: string
  verifyTokenExpiry?: Date
  createdAt?: Date
  updatedAt?: Date
}
