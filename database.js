// Placeholder — Knex instance is created in config/database.js
// This file re-exports it so models don't depend directly on the config module.
const { getDb } = require('../config/database');
module.exports = getDb();
