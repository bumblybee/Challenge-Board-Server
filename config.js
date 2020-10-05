const cookieEnvConfig = {};

if (process.env.NODE_ENV === "development") {
  //nothing extra
}

if (process.env.NODE_ENV === "production") {
  cookieEnvConfig.secure = true;
  cookieEnvConfig.sameSite = "none";
}

exports.COOKIE_CONFIG = {
  httpOnly: true,
  maxAge: 3600000,
  ...cookieEnvConfig,
};

// ********** Discord Config *************

let discordSignupUri;
let discordLoginUri;

if (process.env.NODE_ENV === "development") {
  discordSignupUri = "http://localhost:3000/discord-signup";

  discordLoginUri = "http://localhost:3000/discord-login";
}

if (process.env.NODE_ENV === "production") {
  discordSignupUri = "https://challengeboard.vercel.app/discord-signup";
  discordLoginUri = "https://challengeboard.vercel.app/discord-login";
}

exports.DISCORD_SIGNUP_URI_CONFIG = discordSignupUri;

exports.DISCORD_LOGIN_URI_CONFIG = discordLoginUri;

//*******Reset Password Config ********/

let resetPasswordUrl;

if (process.env.NODE_ENV === "development") {
  resetPasswordUrl = "http://localhost:3000/reset-password";
}

if (process.env.NODE_ENV === "production") {
  resetPasswordUrl = "https://challengeboard.vercel.app/reset-password";
}

exports.RESET_PASSWORD_URL = resetPasswordUrl;
