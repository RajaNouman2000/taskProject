import express from "express";

import {
  createUser,
  getDetail,
  login,
  verifyEmail,
} from "../Controllers/user.js";

const userRouter = express.Router();
userRouter.use(express.urlencoded({ extended: true }));

userRouter.post("/signup", createUser);
userRouter.post("/login", login);
userRouter.post("/getdetail", getDetail);
userRouter.get("/verify/:token", verifyEmail);

export default userRouter;
