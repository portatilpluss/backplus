import { Router } from "express";
import routeLogin from "./route.register.js";

const routes = Router();

routes.use("/", routeLogin);


export default routes;