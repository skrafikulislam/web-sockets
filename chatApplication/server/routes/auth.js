import express from "express";
import { register, login, verify } from "../controllers/register.js";
import multer from "multer";
import authVerify from "../middlewares/auth.js";
import { fetchAllUsers } from "../controllers/user.js";

const route = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

route.post("/register", upload.single("image"), register);
route.post("/login", login);
route.get("/verify", authVerify, verify);

export default route;
