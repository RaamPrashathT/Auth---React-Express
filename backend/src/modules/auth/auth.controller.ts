import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import {
    createAccessToken,
    verifyRefreshToken,
} from "../../shared/lib/auth.js";

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
            const { accessToken, refreshToken } = await authService.login(
                request.body as LoginInput,
            );
            response.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            });

            response.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 10 * 60 * 1000,
                path: "/",
            });

            return response.status(200).json({
                success: true,
                message: "Login successful",
            });
        } catch (error) {
            return response.status(500).json({
                success: false,
                message: "Internal server error: " + error,
            });
        }
    },

    async me(request: Request, response: Response) {
        return response.status(200).json({
            success: true,
            message: "User authenticated",
        })
    },

    async refresh(request: Request, response: Response) {
        try {
            console.log("Cookies object:", request.cookies);
            console.log("Raw cookie header:", request.headers.cookie);
            const refreshToken = request.cookies.refreshToken;
            const verified = await verifyRefreshToken(refreshToken);
            if (!verified) {
                return response.status(401).json({
                    success: false,
                    message: "Invalid refresh token",
                });
            }

            const newAccessToken = await createAccessToken({
                userId: verified.userId,
                email: verified.email,
                tokenType: "access",
            });

            response.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 10 * 60 * 1000,
                path: "/",
            });

            return response.status(200).json({
                success: true,
                message: "Access token refreshed",
            });
        } catch (error) {
            return response.status(500).json({
                success: false,
                message: "Internal server error: " + error,
            });
        }
    },

    async logout(request: Request, response: Response) {
        try {
            response.clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
            });

            response.clearCookie("accessToken", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
            });

            return response.status(200).json({
                success: true,
                message: "Logout successful",
            });
        } catch (error) {
            return response
                .status(500)
                .json({
                    success: false,
                    message: "Internal server error: " + error,
                });
        }
    },
};
