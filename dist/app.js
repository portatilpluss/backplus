"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _dotenv = require("dotenv");
var _routes = _interopRequireDefault(require("./routes"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _cors = _interopRequireDefault(require("cors"));
(0, _dotenv.config)();
var app = (0, _express["default"])();
app.use(_express["default"].json());
app.use((0, _cookieParser["default"])());
app.use((0, _morgan["default"])("dev"));
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _cors["default"])({
  //origin: 'http://localhost:2900',
  origin: 'https://frontplus.onrender.com',
  credentials: true
}));
app.set("port", process.env.PORT || 3100);
app.use("/", _routes["default"]);
var _default = exports["default"] = app;