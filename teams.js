const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const teamsController = require('../controllers/teamsController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');

router.use(authenticate);

// GET /api/teams
router.get('/', teamsController.list);

// POST /api/teams
router.post('/', [
  body('name').trim().notEmpty().isLength({ max: 100 }),
  body('description').optional().isLength({ max: 500 }),
  validate,
], teamsController.create);

// GET /api/teams/:id
router.get('/:id', [param('id').isUUID(), validate], teamsController.getById);

// PATCH /api/teams/:id — admin only
router.patch('/:id', [
  param('id').isUUID(),
  body('name').optional().trim().isLength({ max: 100 }),
  validate,
  authorize('admin'),
], teamsController.update);

// DELETE /api/teams/:id — admin only
router.delete('/:id', [
  param('id').isUUID(),
  validate,
  authorize('admin'),
], teamsController.remove);

// POST /api/teams/:id/invite
router.post('/:id/invite', [
  param('id').isUUID(),
  body('email').isEmail().normalizeEmail(),
  body('role').optional().isIn(['admin', 'member', 'viewer']),
  validate,
  authorize('admin'),
], teamsController.invite);

module.exports = router;
