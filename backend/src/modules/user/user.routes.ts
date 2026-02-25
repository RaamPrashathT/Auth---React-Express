import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate.middleware.js";
import { userController } from "./userController.js";

export const userRouter = Router();

userRouter.get("/allUsers", authenticate, userController.getAllUsers)