const db = require('./database');

const TaskModel = {
  async findAll({ userId, filters = {}, pagination = {} }) {
    const { page = 1, limit = 20 } = pagination;
    let query = db('tasks')
      .where(function () {
        this.where('created_by', userId).orWhere('assignee_id', userId);
      })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset((page - 1) * limit);

    if (filters.status) query = query.where('status', filters.status);
    if (filters.priority) query = query.where('priority', filters.priority);
    if (filters.teamId) query = query.where('team_id', filters.teamId);

    return query;
  },

  async findById(id) {
    return db('tasks').where({ id }).first();
  },

  async create(data) {
    const [task] = await db('tasks')
      .insert({
        title: data.title,
        description: data.description,
        priority: data.priority || 'medium',
        due_date: data.dueDate,
        team_id: data.teamId,
        assignee_id: data.assigneeId,
        created_by: data.createdBy,
        status: 'todo',
      })
      .returning('*');
    return task;
  },

  async update(id, data) {
    const allowed = ['title', 'description', 'status', 'priority', 'due_date', 'assignee_id'];
    const mapped = {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      due_date: data.dueDate,
      assignee_id: data.assigneeId,
    };
    const fields = Object.fromEntries(
      Object.entries(mapped).filter(([k, v]) => allowed.includes(k) && v !== undefined)
    );
    const [task] = await db('tasks')
      .where({ id })
      .update({ ...fields, updated_at: db.fn.now() })
      .returning('*');
    return task;
  },

  async remove(id) {
    return db('tasks').where({ id }).delete();
  },
};

module.exports = TaskModel;
