"use strict";

const router = require("express").Router();

const firm = require("../controllers/firm");

const permissions = require("../middlewares/permissions");

router
  .route("/")
  .get(permissions.is_login, firm.list)
  .post(permissions.is_staff, firm.create);
router
  .route("/:id")
  .get(permissions.is_staff, firm.read)
  .put(permissions.is_staff, firm.update)
  .patch(permissions.is_staff, firm.update)
  .delete(permissions.is_admin, firm.delete);

module.exports = router;