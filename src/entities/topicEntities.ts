export interface ITopic {
  $id?: string
  name: string
  type: 'topic' | 'subtopic'
  parentId?: string
  updatedAt?: Date
}
