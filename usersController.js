const UserModel = require('../models/userModel');

async function getById(req, res, next) {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password_hash, ...safe } = user;
    res.json({ user: safe });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }
    const user = await UserModel.update(req.params.id, req.body);
    const { password_hash, ...safe } = user;
    res.json({ user: safe });
  } catch (err) {
    next(err);
  }
}

module.exports = { getById, update };
