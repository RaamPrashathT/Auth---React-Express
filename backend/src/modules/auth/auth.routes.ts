import { Router } from "express";
import { registerSchema, loginSchema } from "./auth.schema.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { authController } from "./auth.controller.js";

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register);

authRouter.post('/login', validate(loginSchema), authController.login);

authRouter.post('/refresh', authController.refresh);

authRouter.post('/logout', authController.logout)

export default authRouter;