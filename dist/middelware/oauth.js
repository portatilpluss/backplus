"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _dotenv = require("dotenv");
(0, _dotenv.config)();
var verifyToken = exports.verifyToken = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var token, Verify;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          token = req.cookies.token;
          if (token) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", res.status(401).json({
            error: true,
            message: " token!"
          }));
        case 3:
          _context.prev = 3;
          _context.next = 6;
          return _jsonwebtoken["default"].verify(token, process.env.PRIVATE_KEY);
        case 6:
          Verify = _context.sent;
          req.user = Verify;
          next();
          _context.next = 14;
          break;
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](3);
          res.status(403).json({
            error: true,
            message: "Token is not valid!"
          });
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 11]]);
  }));
  return function verifyToken(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// export const verifyTokenEmail = async (req, res , next)=>{
//       const tokenmail = req.cookies.tokenemail;

//       if(!tokenmail){
//         return res.status(401).json({error: true, message: 'Token Email Not Valid'});
//       }
//       try {
//         const verifyEmail = await jwt.verify(tokenmail, process.env.PRIVATE_KEY);
//         next();
//       } catch (error) {
//         console.log("Error",error);
//         res.status(403).json({error: true,message: "Token is not valid!"})

//       }
// }