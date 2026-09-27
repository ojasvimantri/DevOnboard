const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const usersController = require('../controllers/usersController');
const { authenticate } = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');

router.use(authenticate);

// GET /api/users/:id
router.get('/:id', [param('id').isUUID(), validate], usersController.getById);

// PATCH /api/users/:id — users can only update their own profile
router.patch('/:id', [
  param('id').isUUID(),
  body('name').optional().trim().isLength({ max: 100 }),
  body('avatar').optional().isURL(),
  validate,
], usersController.update);

module.exports = router;
