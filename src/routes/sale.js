"use strict";

const router = require("express").Router();

const sale = require("../controllers/sale");

const permissions = require("../middlewares/permissions");

router
  .route("/")
  .get(permissions.is_login, sale.list)
  .post(permissions.is_staff, sale.create);
router
  .route("/:id")
  .get(permissions.is_staff, sale.read)
  .put(permissions.is_staff, sale.update)
  .patch(permissions.is_staff, sale.update)
  .delete(permissions.is_staff, sale.delete);

module.exports = router;