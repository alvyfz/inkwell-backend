/**
 * Interface for a Todo item.
 */
export interface Todo {
  $id?: string
  title: string
  completed: boolean
  userId: string
}
