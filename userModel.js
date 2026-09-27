const db = require('./database');

const UserModel = {
  async findById(id) {
    return db('users').where({ id }).first();
  },

  async findByEmail(email) {
    return db('users').where({ email }).first();
  },

  async create({ email, passwordHash, name }) {
    const [user] = await db('users')
      .insert({ email, password_hash: passwordHash, name })
      .returning('*');
    return user;
  },

  async update(id, fields) {
    const allowed = ['name', 'avatar'];
    const data = Object.fromEntries(
      Object.entries(fields).filter(([k]) => allowed.includes(k))
    );
    const [user] = await db('users')
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return user;
  },
};

module.exports = UserModel;
