const cookieEnvConfig = {};

if (process.env.NODE_ENV === "development") {
  //nothing extra
}

if (process.env.NODE_ENV === "production") {
  cookieEnvConfig.secure = true;
}

exports.COOKIE_CONFIG = {
  httpOnly: true,
  maxAge: 3600000,
  sameSite: "None",
  ...cookieEnvConfig,
};
