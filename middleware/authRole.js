const User = require("../db").User;

exports.authRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.token.data.id;

      const userRecord = await User.findOne({ where: { id: userId } });
      // console.log(userRecord);
      const { role } = userRecord;

      if (!userRecord) {
        return res.status(404).json({ error: "user.notFound" });
      } else if (!!requiredRoles && !isCorrectRole(requiredRoles, role)) {
        return res.status(403).json({ error: "user.unauthorized" });
      } else {
        return next();
      }
    } catch (err) {
      console.log(err);
    }
  };
};

const isCorrectRole = (requiredRoles, userRole) => {
  if (typeof requiredRoles === "string") {
    return userRole === requiredRoles;
  } else {
    return requiredRoles.includes(userRole);
  }
};
