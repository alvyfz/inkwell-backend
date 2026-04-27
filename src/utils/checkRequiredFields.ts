import { isEmpty } from 'lodash'

const checkRequiredFields = (reqBody: any, requiredBody: string[]) => {
  const error: string[] = []
  requiredBody.forEach((key) => {
    if (isEmpty(reqBody[key]) && !Array.isArray(reqBody[key]) && typeof reqBody[key] !== 'number') {
      error.push(key)
    }
  })
  if (error.length > 0) {
    throw new Error(`Missing required fields: ${error.join(', ')}`)
  }
}

export default checkRequiredFields
