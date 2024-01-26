"use strict";

const router = require("express").Router();

const brand = require("../controllers/brand");
const permissions = require("../middlewares/permissions");

router
  .route("/")
  .get(permissions.is_login, brand.list)
  .post(permissions.is_staff, brand.create);
router
  .route("/:id")
  .get(permissions.is_staff, brand.read)
  .put(permissions.is_admin, brand.update)
  .patch(permissions.is_admin, brand.update)
  .delete(permissions.is_admin, brand.delete);

module.exports = router;
