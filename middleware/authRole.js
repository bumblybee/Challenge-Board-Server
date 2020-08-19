const User = require("../db");

const isCorrectRole = (requiredRoles, userRole) => {
  if (typeof requiredRoles === "string") {
    return useRole === requiredRoles;
  } else {
    return requiredRoles.includes(userRole);
  }
};

exports.authRole = (requiredRoles) => {
  return async (req, res, next) => {
    const { id } = req.token.data;
    const user = await User.findOne({ where: { id: id } });

    const role = { user };

    if (!user) {
      return res.status(404).json({ error: "user.notFound" });
    } else if (!!requiredRoles && !isCorrectRole(requiredRoles, role)) {
      return res.status(403).json({ error: user.unauthorized });
    } else {
      return next();
    }
  };
};
