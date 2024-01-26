"use strict";

const router = require("express").Router();

const user = require("../controllers/user");
const { is_login, is_admin } = require("../middlewares/permissions");
router.route("/").get(is_login, user.list).post(user.create);
router
  .route("/:id")
  .get(is_login, user.read)
  .put(is_login, user.update)
  .patch(is_login, user.update)
  .delete(is_admin, user.delete);

module.exports = router;
