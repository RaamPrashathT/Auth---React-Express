import { prisma } from "../../shared/lib/prisma.js";
import type { Request, Response } from "express";

export const userController = {
    async getAllUsers(request: Request, response: Response) {
        try {
            const users = await prisma.user.findMany(); 
            
            return response.status(200).json(users);
        } catch (error) {
            return response.status(500).json({ message: "Error fetching users: " + error});
        }
    }
};