"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _routeRegister = _interopRequireDefault(require("./route.register.js"));
var routes = (0, _express.Router)();
routes.use("/", _routeRegister["default"]);
var _default = exports["default"] = routes;