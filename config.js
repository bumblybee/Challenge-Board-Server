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
  sameSite: "none",
  ...cookieEnvConfig,
};

let discordSignupUri;
let discordLoginUri;

if (process.env.NODE_ENV === "development") {
  discordSignupURI = "http://localhost:3000/discord-signup";

  discordLoginUri = "http://localhost:3000/discord-login";
}

if (process.env.NODE_ENV === "production") {
  discordSignupUri = "https://challengeboard.vercel.app/discord-signup";
  discordLoginUri = "https://challengeboard.vercel.app/discord-login";
}

exports.DISCORD_SIGNUP_URI_CONFIG = discordSignupUri;

exports.DISCORD_LOGIN_URI_CONFIG = discordLoginUri;
