"use strict";

const User = require("../models/user");
const Token = require("../models/token");
const passEnc = require("../helpers/passwordEncrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password.'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                }
            }
        */
    const { email, username, password } = req.body;
    if ((email || username) && password) {
      const user = await User.findOne({ $or: [{ email }, { username }] });

      if (user && user.password == passEnc(password)) {
        if (user.is_active) {
          //TOKEN
          let tokenData = await Token.findOne({ user_id: user._id });
          if (!tokenData) {
            tokenData = await Token.create({
              user_id: user._id,
              token: passEnc(user._id + Date.now()),
            });
          }

          //JWT
          const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_KEY, {
            expiresIn: "30m",
          });
          const refreshToken = jwt.sign(
            { _id: user._id, password: user.password },
            process.env.REFRESH_KEY,
            { expiresIn: "3d" }
          );

          res.send({
            user,
            token: tokenData.token,
            bearer: { accessToken, refreshToken },
          });
        } else {
          res.errorStatusCode = 401;
          throw new Error("This account is not active");
        }
      } else {
        res.errorStatusCode = 401;
        throw new Error("Wrong username/email or password");
      }
    } else {
      res.errorStatusCode = 401;
      throw new Error("Please enter username/email and password");
    }
  },
  reflesh: async (req, res) => {
    /*
            #swagger.tags = ['Authentication']
            #swagger.summary = 'JWT: Refresh'
            #swagger.description = 'Refresh accessToken with refreshToken'
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    bearer: {
                        refresh: '...refreshToken...'
                    }
                }
            }
        */
    const refreshToken = req.body?.bearer?.refreshToken;

    if (refreshToken) {
      jwt().verify(
        refreshToken,
        process.env.REFRESH_KEY,
        async function (err, userData) {
          if (err) {
            res.errorStatusCode = 401;
            throw err;
          } else {
            const { _id, password } = userData;
            if (_id && password) {
              const user = User.findOne({ _id });
              if (user && user.password == password) {
                if (user.is_active) {
                  const accessToken = jwt.sign(
                    user.toJSON(),
                    process.env.ACCESS_KEY + user.password,
                    { expiresIn: "30m" }
                  );
                  res.send({ bearer: { accessToken } });
                } else {
                  res.errorStatusCode = 401;
                  throw new Error("This account is not active");
                }
              } else {
                res.errorStatusCode = 401;
                throw new Error("The password is wrong");
              }
            } else {
              res.errorStatusCode = 401;
              throw new Error("Please enter id and password.");
            }
          }
        }
      );
    }
  },
  logout: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Logout"
            #swagger.description = 'Delete token key.'
        */
    const auth = req.headers?.authorization || null;
    const token = auth ? auth.split(" ") : null;

    let message = null,
      result = {};

    if (token && token[0] === "Token") {
      result = await Token.deleteOne({
        token: token[1],
      });
      message = " Logout was ok";
    } else if (token && token[0] === "Bearer") {
      message = "No need any process for logout. You must delete JWT tokens.";
    }

    res.send({
      message,
      result,
    });
  },
};
