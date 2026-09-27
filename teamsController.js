const TeamModel = require('../models/teamModel');
const UserModel = require('../models/userModel');
const logger = require('../config/logger');

async function list(req, res, next) {
  try {
    const teams = await TeamModel.findByUserId(req.user.id);
    res.json({ teams });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const team = await TeamModel.create({
      ...req.body,
      ownerId: req.user.id,
    });
    // Automatically add the creator as admin
    await TeamModel.addMember(team.id, req.user.id, 'admin');
    logger.info(`Team created: ${team.id} by user ${req.user.id}`);
    res.status(201).json({ team });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const team = await TeamModel.findById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json({ team });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const team = await TeamModel.update(req.params.id, req.body);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json({ team });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await TeamModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function invite(req, res, next) {
  try {
    const { email, role = 'member' } = req.body;
    const invitee = await UserModel.findByEmail(email);
    if (!invitee) return res.status(404).json({ error: 'User not found' });

    await TeamModel.addMember(req.params.id, invitee.id, role);
    logger.info(`User ${invitee.id} added to team ${req.params.id} as ${role}`);
    res.json({ message: 'Member added successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, getById, update, remove, invite };
