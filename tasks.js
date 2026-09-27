const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const tasksController = require('../controllers/tasksController');
const { authenticate } = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');

// All task routes require authentication
router.use(authenticate);

// GET /api/tasks — list tasks with optional filters
router.get('/', [
  query('status').optional().isIn(['todo', 'in_progress', 'done', 'cancelled']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('teamId').optional().isUUID(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validate,
], tasksController.list);

// POST /api/tasks — create a task
router.post('/', [
  body('title').trim().notEmpty().isLength({ max: 255 }),
  body('description').optional().isLength({ max: 2000 }),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('dueDate').optional().isISO8601(),
  body('teamId').optional().isUUID(),
  body('assigneeId').optional().isUUID(),
  validate,
], tasksController.create);

// GET /api/tasks/:id
router.get('/:id', [
  param('id').isUUID(),
  validate,
], tasksController.getById);

// PATCH /api/tasks/:id
router.patch('/:id', [
  param('id').isUUID(),
  body('title').optional().trim().isLength({ max: 255 }),
  body('status').optional().isIn(['todo', 'in_progress', 'done', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('dueDate').optional().isISO8601(),
  validate,
], tasksController.update);

// DELETE /api/tasks/:id
router.delete('/:id', [
  param('id').isUUID(),
  validate,
], tasksController.remove);

module.exports = router;
