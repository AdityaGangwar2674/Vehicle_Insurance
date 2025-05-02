const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have access to this resource.",
      });
    }
    next();
  };
};

module.exports = authorizeRole;
