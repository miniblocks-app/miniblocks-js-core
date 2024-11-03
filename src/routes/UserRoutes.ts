import express from "express";
import { userRegistration } from "../controllers/UserManagement";
const userRouter = express.Router();

userRouter.post("/", userRegistration);

export default userRouter;