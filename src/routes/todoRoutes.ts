import { Router } from 'express'
import { todoController } from '../controller/todoController'
import { sessionMiddleware } from '../middleware/sessionMiddleware'

const router = Router()

router.post('/', sessionMiddleware, todoController.createTodo)
router.get('/', sessionMiddleware, todoController.getTodos)
router.put('/:id', sessionMiddleware, todoController.updateTodo)
router.delete('/:id', sessionMiddleware, todoController.deleteTodo)

export default router
