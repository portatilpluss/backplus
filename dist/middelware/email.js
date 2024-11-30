"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transporter = void 0;
var _dotenv = require("dotenv");
var _nodemailer = _interopRequireDefault(require("nodemailer"));
(0, _dotenv.config)();
var transporter = exports.transporter = _nodemailer["default"].createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASWORDEMAIL
  }
  // logger:true,
  // debug: true
});
transporter.verify().then(function () {
  console.log("Ready for send emails");
});

// GENERADOR DE CODIGO OTP

// console.log(otp);