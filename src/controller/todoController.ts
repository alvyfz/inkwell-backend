import { Request, Response, NextFunction } from 'express'
import { todoService } from '../services/todoService'
import { Todo } from '../models/todo.model'
import AuthenticationError from '../utils/AuthenticationError'

export const todoController = {
  async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.body
      const userId = req.user?.$id

      if (!userId) {
        throw new AuthenticationError('User ID not found in session. Authentication required.')
      }

      const newTodo: Todo = await todoService.createTodo(title, userId)
      res.status(201).json({ status: 'success', data: newTodo })
    } catch (error) {
      next(error)
    }
  },

  async getTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.$id

      if (!userId) {
        throw new AuthenticationError('User ID not found in session. Authentication required.')
      }

      const todos: Todo[] = await todoService.getTodos(userId)
      res.status(200).json({ status: 'success', data: todos })
    } catch (error) {
      next(error)
    }
  },

  async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { completed } = req.body
      const updatedTodo: Todo = await todoService.updateTodo(id, completed)
      res.status(200).json({ status: 'success', data: updatedTodo })
    } catch (error) {
      next(error)
    }
  },

  async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      await todoService.deleteTodo(id)
      res.status(200).json({ status: 'success', message: 'Todo deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
}
