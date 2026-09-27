const { createClient } = require('redis');
const logger = require('./logger');

let client;

async function initRedis() {
  client = createClient({ url: process.env.REDIS_URL });
  client.on('error', (err) => logger.error('Redis error:', err));
  await client.connect();
  return client;
}

function getRedis() {
  if (!client) throw new Error('Redis not initialized. Call initRedis() first.');
  return client;
}

async function setRefreshToken(userId, token) {
  const ttl = parseInt(process.env.REDIS_TTL_SECONDS) || 7 * 24 * 60 * 60;
  await getRedis().setEx(`refresh:${userId}`, ttl, token);
}

async function deleteRefreshToken(userId) {
  await getRedis().del(`refresh:${userId}`);
}

module.exports = { initRedis, getRedis, setRefreshToken, deleteRefreshToken };
