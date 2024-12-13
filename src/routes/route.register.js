import { Router } from "express";
import { insertCode, insertEmail, loginUser, logout, otpCode, register, updatePassword, viewRegister } from "../controllers/controller.register.js";
import { verifyToken, verifyTokenEmail } from "../middelware/oauth.js";
// import { verifyToken } from "../middelware/oauth.js";

const routeLogin = Router();


routeLogin.post("/register", register);
routeLogin.post("/login",loginUser);
routeLogin.get("/view",viewRegister);
routeLogin.put("/update",updatePassword);
routeLogin.post("/email",insertEmail);
routeLogin.post("/code",insertCode);



export default routeLogin;
