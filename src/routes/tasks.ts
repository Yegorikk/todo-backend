import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import pool from '../config/db.js';
import { Task, AuthRequest } from '../types/index.js';

const router = express.Router();

// Get all user's tasks
router.get('/tasks', auth, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await pool.query<Task>(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user?.id]
    );
    res.json(tasks.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task
router.post('/tasks', [
  auth,
  body('title').notEmpty().trim(),
  body('priority').isIn(['low', 'medium', 'high']),
  body('status').isIn(['todo', 'in_progress', 'done']),
  body('deadline').optional().isISO8601()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, deadline, status } = req.body;
    const newTask = await pool.query<Task>(
      'INSERT INTO tasks (title, description, priority, deadline, status, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, priority, deadline, status, req.user?.id]
    );

    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/tasks/:id', [
  auth,
  body('title').optional().trim(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['todo', 'in_progress', 'done']),
  body('deadline').optional().isISO8601()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, priority, deadline, status } = req.body;

    // Check if task belongs to user
    const task = await pool.query<Task>(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await pool.query<Task>(
      `UPDATE tasks 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           priority = COALESCE($3, priority),
           deadline = COALESCE($4, deadline),
           status = COALESCE($5, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [title, description, priority, deadline, status, id, req.user?.id]
    );

    res.json(updatedTask.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/tasks/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query<Task>(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 