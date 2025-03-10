export interface IArticle {
  authorId: string
  title: string
  content: string
  tagIds?: string[]
  coverImage?: string
  publishedDate?: Date
  status: 'draft' | 'unpublished' | 'published'
  likes?: string[]
  createdAt: Date
  updatedAt: Date
}
