const db = require('./database');

const TeamModel = {
  async findByUserId(userId) {
    return db('teams')
      .join('team_members', 'teams.id', 'team_members.team_id')
      .where('team_members.user_id', userId)
      .select('teams.*', 'team_members.role');
  },

  async findById(id) {
    const team = await db('teams').where({ id }).first();
    if (!team) return null;
    team.members = await db('team_members')
      .join('users', 'team_members.user_id', 'users.id')
      .where('team_members.team_id', id)
      .select('users.id', 'users.name', 'users.email', 'team_members.role');
    return team;
  },

  async create({ name, description, ownerId }) {
    const [team] = await db('teams')
      .insert({ name, description, owner_id: ownerId })
      .returning('*');
    return team;
  },

  async update(id, { name, description }) {
    const [team] = await db('teams')
      .where({ id })
      .update({ name, description, updated_at: db.fn.now() })
      .returning('*');
    return team;
  },

  async remove(id) {
    return db('teams').where({ id }).delete();
  },

  async addMember(teamId, userId, role = 'member') {
    return db('team_members')
      .insert({ team_id: teamId, user_id: userId, role })
      .onConflict(['team_id', 'user_id'])
      .merge({ role });
  },

  async getMembership(teamId, userId) {
    return db('team_members')
      .where({ team_id: teamId, user_id: userId })
      .first();
  },
};

module.exports = TeamModel;
