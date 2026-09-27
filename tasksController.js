const TaskModel = require('../models/taskModel');
const { emitToTeam } = require('../config/socket');
const logger = require('../config/logger');

async function list(req, res, next) {
  try {
    const { status, priority, teamId, page = 1, limit = 20 } = req.query;
    const tasks = await TaskModel.findAll({
      userId: req.user.id,
      filters: { status, priority, teamId },
      pagination: { page: Number(page), limit: Number(limit) },
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const task = await TaskModel.create({
      ...req.body,
      createdBy: req.user.id,
    });

    if (task.team_id) {
      emitToTeam(task.team_id, 'task:created', { task });
    }

    logger.info(`Task created: ${task.id} by user ${req.user.id}`);
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const task = await TaskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const hasAccess = task.created_by === req.user.id || task.assignee_id === req.user.id;
    if (!hasAccess) return res.status(403).json({ error: 'Forbidden' });

    res.json({ task });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const task = await TaskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.created_by !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const updated = await TaskModel.update(req.params.id, req.body);

    if (updated.team_id) {
      emitToTeam(updated.team_id, 'task:updated', { task: updated });
    }

    res.json({ task: updated });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const task = await TaskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.created_by !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await TaskModel.remove(req.params.id);

    if (task.team_id) {
      emitToTeam(task.team_id, 'task:deleted', { taskId: req.params.id });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, getById, update, remove };
