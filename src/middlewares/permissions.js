"use strict";

// Middleware: permissions

module.exports = {
  is_login: (req, res, next) => {
    if (req.user && req.user.is_active) next();
    else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login");
    }
  },
  is_admin: (req, res, next) => {
    if (req.user && req.user.is_active && req.user.is_superadmin) next();
    else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login and to be  Admin");
    }
  },
  is_staff: (req, res, next) => {
    if (
      req.user &&
      req.user.is_active &&
      (req.user.is_superadmin || req.user.is_staff)
    )
      next();
    else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login and to be  Staff");
    }
  },
};
