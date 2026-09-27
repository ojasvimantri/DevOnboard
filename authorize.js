const TeamModel = require('../models/teamModel');

/**
 * Middleware factory: checks that the authenticated user has the required role
 * in the team referenced by req.params.id.
 * Usage: authorize('admin')
 */
function authorize(requiredRole) {
  const ROLE_HIERARCHY = { viewer: 0, member: 1, admin: 2 };

  return async function (req, res, next) {
    try {
      const teamId = req.params.id;
      const membership = await TeamModel.getMembership(teamId, req.user.id);

      if (!membership) {
        return res.status(403).json({ error: 'You are not a member of this team' });
      }

      const userLevel = ROLE_HIERARCHY[membership.role] ?? -1;
      const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 999;

      if (userLevel < requiredLevel) {
        return res.status(403).json({
          error: `Requires '${requiredRole}' role. Your role: '${membership.role}'`,
        });
      }

      req.membership = membership;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { authorize };
