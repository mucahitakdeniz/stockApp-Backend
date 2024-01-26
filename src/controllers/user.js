"use strict";

const User = require("../models/user");
const Token = require("../models/token");
const passEnc = require("../helpers/passwordEncrypt");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

    const filters = req.user?.is_superadmin ? {} : { _id: req.user._id };

    const data = await res.getModelList(User, filters);

    res.status(200).send(data);
  },
  create: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Create User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "first_name": "test",
                    "last_name": "test",
                }
            }
        */
    if (!req.user?.is_superadmin) {
      req.body.is_staff = false;
      req.body.is_superadmin = false;
    }
    const data = await User.create(req.body);
    let token = null;
    if (data.username) {
      token = await Token.create({
        user_id: data._id,
        token: passEnc(data._id + Date.now()),
      });
    }

    res.status(200).send({ data, token: token.token });
  },
  read: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single User"
        */
    const filters = req.user?.is_superadmin
      ? { _id: req.params.id }
      : { _id: req.user._id };

    const data = await User.findOne(filters);

    res.status(200).send(data);
  },
  update: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "first_name": "test",
                    "last_name": "test",
                }
            }
        */
    req.body.is_superadmin = req.user?.is_superadmin
      ? req.body.is_superadmin
      : false;

    if (!req.user.is_superadmin) {
      req.body.is_staff = req.user?.is_staff
    }

    const filters = req.user?.is_superadmin
      ? { _id: req.params.id }
      : { _id: req.user._id };

    const data = await User.updateOne(filters, req.body);

    res.status(202).send({
      data,
      new: await User.findOne(filters),
    });
  },
  delete: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete User"
        */
    const filters = req.user?.is_superadmin
      ? { _id: req.params.id }
      : { _id: req.user._id };

    const data = await User.deleteOne(filters);

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
