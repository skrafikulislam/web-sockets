import express from "express";
import { fetchAllUsers } from "../controllers/user.js";
import authVerify from "../middlewares/auth.js";

const route = express.Router();

route.get("/allusers", authVerify, fetchAllUsers)

export default route;
    