import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import { createAccessToken } from "../../shared/lib/auth.js";

export const authController = {
    async register(request: Request, response: Response) {
        try {
            const result = await authService.register(
                request.body as RegisterInput,
            );
            if (result.message === "Account linked to existing user") {
                return response.status(200).json({
                    success: true,
                    message: "Account linked to existing user",
                });
            }
            return response.status(201).json({
                success: true,
                message: "User registered successfully",
            });
        } catch (error) {
            console.error("Error in authController.register:", error);
            if (
                error instanceof Error &&
                error.message === "User with this email already exists"
            ) {
                response
                    .status(400)
                    .json({ success: false, message: error.message });
                return;
            }
            return response
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },

    async login(request: Request, response: Response) {
        try {
            const result = await authService.login(request.body as LoginInput);

            
        }
    }
};
