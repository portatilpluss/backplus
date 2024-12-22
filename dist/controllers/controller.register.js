"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewRegister = exports.updatePassword = exports.register = exports.loginUser = exports.insertEmail = exports.insertCode = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _db = _interopRequireDefault(require("../db/db.js"));
var _dotenv = require("dotenv");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _email = require("../middelware/email.js");
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _otpGenerator = _interopRequireDefault(require("otp-generator"));
(0, _dotenv.config)();
var register = exports.register = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var name, lastname, age, phone, email, paswordsin, idrole, salt, paswordhash, pasword, _yield$pool$query, _yield$pool$query2, result, _yield$pool$query3, _yield$pool$query4, lastInsertResult, iduser, authresult;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          name = req.body.name;
          lastname = req.body.lastname;
          age = req.body.age;
          phone = req.body.phone;
          email = req.body.email;
          paswordsin = req.body.pasword;
          idrole = req.body.idrole;
          _context.prev = 7;
          _context.next = 10;
          return _bcrypt["default"].genSalt(5);
        case 10:
          salt = _context.sent;
          _context.next = 13;
          return _bcrypt["default"].hash(paswordsin, salt);
        case 13:
          paswordhash = _context.sent;
          pasword = paswordhash;
          _context.next = 17;
          return _db["default"].query("CALL SP_REGISTER(?,?,?,?);", [name, lastname, age, phone]);
        case 17:
          _yield$pool$query = _context.sent;
          _yield$pool$query2 = (0, _slicedToArray2["default"])(_yield$pool$query, 1);
          result = _yield$pool$query2[0];
          if (!(result.affectedRows == 1)) {
            _context.next = 34;
            break;
          }
          _context.next = 23;
          return _db["default"].query('SELECT LAST_INSERT_ID() AS iduser');
        case 23:
          _yield$pool$query3 = _context.sent;
          _yield$pool$query4 = (0, _slicedToArray2["default"])(_yield$pool$query3, 1);
          lastInsertResult = _yield$pool$query4[0];
          iduser = lastInsertResult[0].iduser; // Obtenemos el iduser insertado
          _context.next = 29;
          return _db["default"].query("CALL SP_AUTHREGISTER(?,?,?,?);", [iduser, email, pasword, idrole]);
        case 29:
          authresult = _context.sent;
          if (!(authresult[0].affectedRows == 1)) {
            _context.next = 32;
            break;
          }
          return _context.abrupt("return", res.status(200).json({
            error: false,
            message: "User Register"
          }));
        case 32:
          _context.next = 35;
          break;
        case 34:
          res.status(401).json({
            error: true,
            message: "User No Register"
          });
        case 35:
          _context.next = 41;
          break;
        case 37:
          _context.prev = 37;
          _context.t0 = _context["catch"](7);
          console.error("Error Fuction:", _context.t0);
          res.status(500).json({
            error: true,
            message: "Error"
          });
        case 41:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[7, 37]]);
  }));
  return function register(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var loginUser = exports.loginUser = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$body, email, pasword, result, comparePasword, user, _payload, _token, role;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, pasword = _req$body.pasword;
          _context2.prev = 1;
          _context2.next = 4;
          return _db["default"].query("CALL SP_LOGIN(?);", [email]);
        case 4:
          result = _context2.sent;
          if (!(result[0][0].length === 0)) {
            _context2.next = 7;
            break;
          }
          return _context2.abrupt("return", res.status(401).json({
            error: true,
            message: "User No Register"
          }));
        case 7:
          _context2.next = 9;
          return _bcrypt["default"].compare(pasword, result[0][0][0].pasword);
        case 9:
          comparePasword = _context2.sent;
          if (comparePasword) {
            _context2.next = 14;
            break;
          }
          return _context2.abrupt("return", res.status(401).json({
            error: true,
            message: "¡Password or Email Incorrect!"
          }));
        case 14:
          user = result[0][0][0];
          if (!(user.idrole === 1 || user.idrole === 2)) {
            _context2.next = 23;
            break;
          }
          _payload = {
            email: user.email,
            idrole: user.idrole
          };
          _token = _jsonwebtoken["default"].sign(_payload, process.env.PRIVATE_KEY, {
            expiresIn: process.env.EXPIRES_IN
          });
          res.cookie('token', _token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60
          });
          role = user.idrole === 1 ? 'Admin' : 'User';
          return _context2.abrupt("return", res.status(200).json({
            error: false,
            message: "Welcome ".concat(role),
            token: _token,
            payload: _payload
          }));
        case 23:
          return _context2.abrupt("return", res.status(500).json({
            error: true,
            message: "Rol Incorrect!",
            token: token,
            payload: payload
          }));
        case 24:
          _context2.next = 30;
          break;
        case 26:
          _context2.prev = 26;
          _context2.t0 = _context2["catch"](1);
          console.error("Error Fuction:", _context2.t0);
          res.status(500).json({
            error: true,
            message: "Error"
          });
        case 30:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 26]]);
  }));
  return function loginUser(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var viewRegister = exports.viewRegister = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var resukt;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _db["default"].query("CALL SP_VIEW_REGISTER();");
        case 3:
          resukt = _context3.sent;
          // console.log(resukt);

          res.status(200).json({
            error: false,
            resul: resukt[0]
          });
          _context3.next = 11;
          break;
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error("Error Fuction:", _context3.t0);
          res.status(500).json({
            error: true,
            message: "Error"
          });
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function viewRegister(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var insertEmail = exports.insertEmail = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var email, result, users, payloadEmail, tokenEmail, iduser, code, expiresdate, expires;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          email = req.body.email;
          _context4.prev = 1;
          _context4.next = 4;
          return _db["default"].query("CALL INSERTEMAIL(?);", [email]);
        case 4:
          result = _context4.sent;
          if (!(result[0][0].length === 0)) {
            _context4.next = 7;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            error: true,
            message: "Email not Exist"
          }));
        case 7:
          users = result[0][0][0];
          payloadEmail = {
            email: users.email
          };
          tokenEmail = _jsonwebtoken["default"].sign(payloadEmail, process.env.PRIVATE_KEY, {
            expiresIn: '1h'
          });
          res.cookie('tokenemail', tokenEmail, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 50
          });
          iduser = result[0][0][0].iduser;
          code = _otpGenerator["default"].generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true
          }); // Calcular fecha de expiración
          expiresdate = new Date();
          expiresdate.setMinutes(expiresdate.getMinutes() + 5);
          expires = expiresdate.toISOString().slice(0, 19).replace('T', ' ');
          _context4.next = 18;
          return _db["default"].query("CALL OTPGENERATOR(?,?,?);", [iduser, code, expires]);
        case 18:
          _context4.next = 20;
          return _email.transporter.sendMail({
            from: "\"Code Sent\" ".concat(process.env.EMAIL, " "),
            to: email,
            subject: "Code Sent",
            html: "\n                <b>Hello ".concat(email, "! This is Code the Confirmation!\xA1\n                <h1>").concat(code, "</h1>\n                \n                </b>\n                ")
          });
        case 20:
          return _context4.abrupt("return", res.status(200).json({
            error: false,
            message: "Code Sent successfully",
            payloadEmail: payloadEmail,
            tokenEmail: tokenEmail
          }));
        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](1);
          console.log(_context4.t0);
          res.status(500).json({
            error: true,
            message: "Error Controller"
          });
        case 27:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[1, 23]]);
  }));
  return function insertEmail(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var insertCode = exports.insertCode = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var code, resukt;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          code = req.body.code;
          _context5.prev = 1;
          _context5.next = 4;
          return _db["default"].query("CALL INSERTCODE(?);", [code]);
        case 4:
          resukt = _context5.sent;
          if (!(resukt[0][0].length === 0)) {
            _context5.next = 7;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            error: true,
            message: "Expired Code"
          }));
        case 7:
          // res.clearCookie('tokenemail');
          res.status(200).json({
            error: false,
            message: "Code Correct"
          });
          _context5.next = 14;
          break;
        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](1);
          console.error("Error Fuction:", _context5.t0);
          res.status(500).json({
            error: true,
            message: "Error"
          });
        case 14:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 10]]);
  }));
  return function insertCode(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var updatePassword = exports.updatePassword = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var email, paswordChange, salt, UpdatePasword, pasword, result;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          email = req.body.email;
          paswordChange = req.body.pasword;
          _context6.prev = 2;
          _context6.next = 5;
          return _bcrypt["default"].genSalt(10);
        case 5:
          salt = _context6.sent;
          _context6.next = 8;
          return _bcrypt["default"].hash(paswordChange, salt);
        case 8:
          UpdatePasword = _context6.sent;
          pasword = UpdatePasword;
          _context6.next = 12;
          return _db["default"].query("CALL SP_CHANGE_PASSWORD(?,?);", [email, pasword]);
        case 12:
          result = _context6.sent;
          if (!(result[0].affectedRows == 1)) {
            _context6.next = 17;
            break;
          }
          return _context6.abrupt("return", res.status(200).json({
            error: false,
            message: "Password Changed"
          }));
        case 17:
          return _context6.abrupt("return", res.status(400).json({
            error: true,
            message: "Email not found"
          }));
        case 18:
          _context6.next = 24;
          break;
        case 20:
          _context6.prev = 20;
          _context6.t0 = _context6["catch"](2);
          console.error("Error Fuction:", _context6.t0);
          res.status(500).json({
            error: true,
            message: "Error"
          });
        case 24:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[2, 20]]);
  }));
  return function updatePassword(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();