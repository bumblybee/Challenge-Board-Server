const argon2 = require("argon2");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { User } = require("../models/db");

exports.signUpUser = async (req, res) => {
  //Get username, email, and password from client
  // await hashed password
  // create newUser object with id, username, password
  // Create user in db
  // create user object to res.send
  // res.json created user object
};

const generateJWT = (user) => {
  //create user data object to sign to jwt
  //buffer jwt secret
  // set expiration
  //return signed jwt with data object, secret, {expiresIn}
};

exports.loginUser = async (req, res) => {
  // get email and password from client
  // this may change with discord login?
  // find user in db
  // if no user match
  // else if user match
  //verify password and store
  // handle if incorrect password
  // send "jwt" cookie with jwt token - httpOnly and maxAge
  //send api data
};
