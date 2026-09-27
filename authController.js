const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/userModel');
const { setRefreshToken, deleteRefreshToken } = require('../config/redis');
const logger = require('../config/logger');

const SALT_ROUNDS = 12;

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserModel.create({ email, passwordHash, name });

    const { accessToken, refreshToken } = generateTokens(user);
    await setRefreshToken(user.id, refreshToken);

    logger.info(`New user registered: ${user.id}`);
    res.status(201).json({ user: sanitize(user), accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    await setRefreshToken(user.id, refreshToken);

    res.json({ user: sanitize(user), accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

async function refreshToken(req, res, next) {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return res.status(401).json({ error: 'Refresh token required' });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await UserModel.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const tokens = generateTokens(user);
    await setRefreshToken(user.id, tokens.refreshToken);
    res.json(tokens);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await deleteRefreshToken(req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res) {
  res.json({ user: sanitize(req.user) });
}

// ── Helpers ────────────────────────────────────────────────────

function generateTokens(user) {
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
  const refreshToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  return { accessToken, refreshToken };
}

function sanitize(user) {
  const { password_hash, ...safe } = user;
  return safe;
}

module.exports = { register, login, refreshToken, logout, getMe };
