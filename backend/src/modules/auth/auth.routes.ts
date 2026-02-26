import { Router } from "express";
import { registerSchema, loginSchema } from "./auth.schema.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { authController } from "./auth.controller.js";
import { OAuthController } from "./OAuth/oauth.controller.js";
import { OAuthGoogleCallback } from "./OAuth/google.oauth.js";

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register);

authRouter.post('/login', validate(loginSchema), authController.login);

authRouter.post('/refresh', authController.refresh);

authRouter.post('/logout', authController.logout)

// OAuth routes
authRouter.get('/google', OAuthController.google); 

authRouter.get('/google/callback', OAuthGoogleCallback);

export default authRouter;