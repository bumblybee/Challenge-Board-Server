//********** Cookie Config ************/

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

// ********* Discord Cookie Config

const discordCookieEnvConfig = {};

if (process.env.NODE_ENV === "development") {
  //nothing extra
}

if (process.env.NODE_ENV === "production") {
  discordCookieEnvConfig.secure = true;
  discordCookieEnvConfig.sameSite = "none";
}

exports.DISCORD_COOKIE_CONFIG = {
  httpOnly: true,
  maxAge: 1000 * 60 * 20,
  ...discordCookieEnvConfig,
};

// ********** Discord Uri Config *************

let discordSignupUri;
let discordLoginUri;

if (process.env.NODE_ENV === "development") {
  discordSignupUri = "http://localhost:3000/discord-signup";

  discordLoginUri = "http://localhost:3000/discord-login";
}

if (process.env.NODE_ENV === "production") {
  discordSignupUri = "https://challengeboard.xyz/discord-signup";
  discordLoginUri = "https://challengeboard.xyz/discord-login";
}

exports.DISCORD_SIGNUP_URI_CONFIG = discordSignupUri;

exports.DISCORD_LOGIN_URI_CONFIG = discordLoginUri;

//*******Reset Password Config ********/

let resetPasswordUrl;

if (process.env.NODE_ENV === "development") {
  resetPasswordUrl = "http://localhost:3000/reset-password";
}

if (process.env.NODE_ENV === "production") {
  resetPasswordUrl = "https://challengeboard.xyz/reset-password";
}

exports.RESET_PASSWORD_URL = resetPasswordUrl;
