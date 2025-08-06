const verifyPermission = (requiredPermission) => {
    return (req, res, next) => {
      const user = req.user;
      if (!user || !user.permissions.includes(requiredPermission)) {
        return res.status(403).json({ error: "Access denied" });
      }
  
      next();
    };
  };

  module.exports = verifyPermission;