"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _controllerRegister = require("../controllers/controller.register.js");
var _oauth = require("../middelware/oauth.js");
// import { verifyToken } from "../middelware/oauth.js";

var routeLogin = (0, _express.Router)();
routeLogin.post("/register", _controllerRegister.register);
routeLogin.post("/admin-reg", _controllerRegister.registerAdmin);
routeLogin.post("/login", _controllerRegister.loginUser);
routeLogin.get("/view", _oauth.verifyToken, _controllerRegister.viewRegister);
routeLogin.put("/update", _controllerRegister.updatePassword);
routeLogin.post("/email", _controllerRegister.insertEmail);
routeLogin.post("/code", _controllerRegister.insertCode);
// routeLogin.get("/view-admin",viewAdmin);
routeLogin.get("/admins", _controllerRegister.admins);
routeLogin["delete"]("/delete/:idemployes", _controllerRegister.deleteAdmins);
var _default = exports["default"] = routeLogin;