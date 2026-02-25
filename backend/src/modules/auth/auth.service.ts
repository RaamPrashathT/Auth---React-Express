import generateName from "../../shared/lib/generateName.js";
import { prisma } from "../../shared/lib/prisma.js";
import type { RegisterInput } from "./auth.schema.js";
import bcrypt from "bcryptjs";

export const authService = {
    async register(data: RegisterInput) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
            include: { accounts: true },
        });

        if (existingUser) {
            const hasPasswordAccount = existingUser.accounts.some(
                (account) => account.provider === "credentials",
            );

            if (hasPasswordAccount) {
                throw new Error("User with this email already exists");
            }
            const hashedPassword = await bcrypt.hash(data.password, 10);
            await prisma.account.create({
                data: {
                    userId: existingUser.id,
                    provider: "credentials",
                    providerAccountID: existingUser.email,
                    password: hashedPassword,
                },
            });
            return { message: "Account linked to existing user" };
        }
        const randomName = generateName();
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await prisma.user.create({
            data: {
                username: randomName,
                email: data.email,
                accounts: {
                    create: {
                        provider: "credentials",
                        providerAccountID: data.email,
                        password: hashedPassword,
                    },
                },
            },
        });

        return {message: "User registered successfully", userId: newUser.id};
    },
};
