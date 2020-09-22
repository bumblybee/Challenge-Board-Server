const DiscordOauth2 = require("discord-oauth2");
const crypto = require("crypto");
const authService = require("./authService");
const { CustomError } = require("../handlers/errorHandlers");

// set up the service with some base information
const oauth = new DiscordOauth2({
  clientId: process.env.DISCORD_CLIENT, // provided when you sign up on Discord for an app
  clientSecret: process.env.DISCORD_SECRET, // can redirectUri here so you don't repeat yourself, but need two different uris for login and signup?
});

exports.generateSignupDiscordURL = () => {
  const url = oauth.generateAuthUrl({
    scope: ["identify", "email"], // see Discord OAuth docs for scope info
    state: crypto.randomBytes(16).toString("hex"),
    redirectUri: "http://localhost:3000/discord-signup",
  });

  return url;
};

exports.generateLoginDiscordURL = () => {
  const url = oauth.generateAuthUrl({
    scope: ["identify", "email"], // see Discord OAuth docs for scope info
    state: crypto.randomBytes(16).toString("hex"), // look familiar? cryptographically-secure random 16 bytes
    redirectUri: "http://localhost:3000/discord-login",
  });

  return url;
};

exports.createDiscordUser = async (code) => {
  // grab an access_token from Discord based on the code and any prior scope

  const tokenResponse = await oauth.tokenRequest({
    code: code,
    scope: "identify email",
    grantType: "authorization_code", // check the Discord OAuth docs for various grantTypes
    redirectUri: "http://localhost:3000/discord-signup",
  });

  const { access_token } = tokenResponse;

  // now that we have the access_token, let's get some user information
  const discordUser = await oauth.getUser(access_token);

  if (discordUser) {
    const { email, username } = discordUser;

    // authService will handle creating the user in the database for us
    const createdUser = await authService.signupDiscordUser(email, username);

    // create the JWT here, but let the controller set the cookie
    const jwt = authService.generateJWT(createdUser);

    return {
      jwt,
      user: createdUser,
    };
  } else {
    throw new CustomError("auth.discordError", "DiscordError", 401);
  }
};

exports.loginDiscordUser = async (code) => {
  const tokenResponse = await oauth.tokenRequest({
    code: code,
    scope: "identify email",
    grantType: "authorization_code",
    redirectUri: "http://localhost:3000/discord-login",
  });

  const { access_token } = tokenResponse;

  const discordUser = await oauth.getUser(access_token);

  if (discordUser) {
    const { email, username } = discordUser;

    const createdUser = await authService.loginDiscordUser(email, username);

    logger.info(`Discord user ${username} logged in`);

    const jwt = authService.generateJWT(createdUser);

    return {
      jwt,
      user: createdUser,
    };
  } else {
    throw new CustomError("auth.discordError", "DiscordError", 401);
  }
};
