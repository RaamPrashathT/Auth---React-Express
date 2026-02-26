import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/auth.js";

export const authenticate = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const token = request.cookies.accessToken;

        if (!token) {
            return response
                .status(401)
                .json({ message: "Unauthorized: No token provided" });
        }

        const decoded = await verifyAccessToken(token);

        if (!decoded) {
            return response
                .status(401)
                .json({ message: "Unauthorized: Invalid token" });
        }

        next();
    } catch (error) {
        return response
            .status(401)
            .json({ message: "Authentication failed: " + error });
    }
};
