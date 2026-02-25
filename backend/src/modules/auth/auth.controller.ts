import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import type { RegisterInput } from "./auth.schema.js";

export const authController = {
    async register(request: Request, response: Response) {
        try {
            const result = await authService.register(request.body as RegisterInput);
            if(result.message === "Account linked to existing user") {
                return response.status(200).json({message: "Account linked to existing user"});
            }
            return response.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            if(error instanceof Error && error.message === "User with this email already exists") {
                response.status(400).json({ message: error.message });
                return
            }
            return response.status(500).json({ message: "Internal server error" });
        }
    }
}