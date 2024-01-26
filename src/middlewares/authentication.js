"use strict";

// app.use(authentication):

const Token = require("../models/token");
const Jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const auth = req.headers?.authorization || null;
  const tokenKey = auth ? auth.split(" ") : null;

  if (tokenKey && tokenKey[0] == "Token") {
    const tokenData = await Token.findOne({ token: tokenKey[1] }).populate(
      "user_id"
    );
    req.user = tokenData ? tokenData.user_id : undefined;
  } else if (tokenKey && tokenKey[0] == "Bearer") {
    Jwt.verify(
      tokenKey[1],
      process.env.ACCESS_KEY,
      (err, userData) => req.user = userData
    );
  }
  next();
};
