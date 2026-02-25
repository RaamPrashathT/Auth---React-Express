import { Router } from "express";
import { registerSchema } from "./auth.schema.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { authController } from "./auth.controller.js";

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register)

export default authRouter;