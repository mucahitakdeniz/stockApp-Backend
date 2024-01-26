"use strict";

const router = require("express").Router();

const auth = require("../controllers/auth");

router.route("/login").post(auth.login);
router.route("/refresh").get(auth.reflesh);
router.route("/refresh").post(auth.reflesh);
router.route("/logout").get(auth.logout);
router.route("/logout").post(auth.logout);

module.exports=router
