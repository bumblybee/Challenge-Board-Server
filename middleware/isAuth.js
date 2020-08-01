const jwt = require("express-jwt");
const cookie = require("cookie");

const getTokenFromHeader = (req) => {
  if (req.headers) {
    const cookieToken = cookie.parse(req.headers.cookie).jwt;
    return cookieToken;
  }
};

exports.isAuth = jwt({
  secret: Buffer.from(process.env.JWT_SECRET, "base64"),
  userProperty: "token",
  getToken: getTokenFromHeader,
  algorithms: ["HS256"],
  credentialsRequired: true,
});
