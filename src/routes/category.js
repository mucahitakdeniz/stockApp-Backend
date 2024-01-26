"use strict";

const router = require("express").Router();

const category = require("../controllers/category");
const permissions = require("../middlewares/permissions");

router
  .route("/")
  .get(permissions.is_login, category.list)
  .post(permissions.is_admin, category.create);
router
  .route("/:id")
  .get(permissions.is_staff, category.read)
  .put(permissions.is_admin, category.update)
  .patch(permissions.is_admin, category.update)
  .delete(permissions.is_admin, category.delete);

module.exports = router;