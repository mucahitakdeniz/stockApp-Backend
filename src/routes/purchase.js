"use strict";

const router = require("express").Router();

const purchase = require("../controllers/purchase");
const permissions = require("../middlewares/permissions");

router
  .route("/")
  .get(permissions.is_login, purchase.list)
  .post(permissions.is_staff, purchase.create);
router
  .route("/:id")
  .get(permissions.is_staff, purchase.read)
  .put(permissions.is_staff, purchase.update)
  .patch(permissions.is_staff, purchase.update)
  .delete(permissions.is_staff, purchase.delete);

module.exports = router;