import { Router } from "express";
import { admins, deleteAdmins, insertCode, insertEmail, loginUser, logout, otpCode, register, registerAdmin, updatePassword, viewAdmin, viewRegister } from "../controllers/controller.register.js";
import { verifyToken } from "../middelware/oauth.js";
// import { verifyToken } from "../middelware/oauth.js";

const routeLogin = Router();


routeLogin.post("/register", register);
routeLogin.post("/admin-reg", registerAdmin);
routeLogin.post("/login",loginUser);
routeLogin.get("/view",verifyToken,viewRegister);
routeLogin.put("/update",updatePassword);
routeLogin.post("/email",insertEmail);
routeLogin.post("/code",insertCode);
// routeLogin.get("/view-admin",viewAdmin);
routeLogin.get("/admins",admins);
routeLogin.delete("/delete/:idemployes",deleteAdmins);



export default routeLogin;
