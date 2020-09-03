const cookie = require("cookie");
const { COOKIE_CONFIG } = require("../config");

const discordOAuthService = require("../services/discordService");

const { CustomError } = require("../handlers/errorHandlers");

function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

exports.getDiscordUrl = (req, res) => {
  // Passes scope and crypto state, along with client id and redirect URI, constructed in library method
  const url = discordOAuthService.generateDiscordURL();

  res.cookie("state", getParameterByName("state", url), {
    maxAge: 1000 * 60 * 20,
  });

  res.json({
    discordUrl: url,
  });
};

//Get state from req header
const getStateFromHeader = (req) => {
  if (req.headers) {
    const state = cookie.parse(req.headers.cookie).state;
    return state;
  }
};

exports.authenticateDiscordUser = async (req, res) => {
  try {
    // URL contains state and code when user redirected back to app by redirect uri specified

    const { code, state } = req.body;

    // If no code returned then something went wrong with requesting the token from Discord
    if (!code) {
      throw new CustomError("auth.discordError", "DiscordError", 400);
    }
    //Get state from header
    const previousState = getStateFromHeader(req);

    if (previousState === state) {
      // Function that requests token from Discord, gens JWT, returns user data and JWT
      const { jwt, user } = await discordOAuthService.createDiscordUser(code);

      if (user) {
        res.cookie("jwt", jwt, COOKIE_CONFIG);

        res.json(user);
      } else {
        res.json({ error });
      }
    } else {
      throw new CustomError("auth.discordError", "DiscordError", 401);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.loginDiscordUser = async (req, res) => {
  const { code, state } = req.body;

  if (!code) {
    throw new CustomError("auth.discordError", "DiscordError", 400);
  }

  const previousState = getStateFromHeader(req);

  if (previousState === state) {
    // Function that requests token from Discord, gens JWT, returns user data and JWT
    const { jwt, user } = await discordOAuthService.checkDiscordUser(code);

    if (user) {
      res.cookie("jwt", jwt, COOKIE_CONFIG);

      res.json(user);
    } else {
      res.json({ error });
    }
  } else {
    throw new CustomError("auth.discordError", "DiscordError", 401);
  }
};
