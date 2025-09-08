import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

dotenv.config()

export async function connect() {
  console.log(process.env.MONGO_URI, 'mongo url')
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.ENV
    })
    const connection = mongoose.connection
    connection.on('connected', () => {
      console.log('MongoDB connected Successfully')
    })

    connection.on('error', (err) => {
      console.log('MongoDB connection error. Please make sure mongoDB is running. ', err)
      process.exit()
    })
  } catch (error) {
    console.log('Somenthing goes wrong', error)
  }
}
