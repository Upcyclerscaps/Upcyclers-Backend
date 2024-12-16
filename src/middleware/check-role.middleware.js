/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this resource'
      });
    }

    next();
  };
};

module.exports = checkRole;