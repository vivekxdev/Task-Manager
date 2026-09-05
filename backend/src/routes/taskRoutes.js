import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.route('/')
  .get(getTasks)
  .post(createTask);
router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

export default router;