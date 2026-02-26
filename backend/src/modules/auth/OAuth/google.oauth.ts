import { createAccessToken } from "../../../shared/lib/auth.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { redis } from "../../../shared/lib/redis.js";
import { ProfileSchema } from "../auth.schema.js";
import type { Request, Response } from "express";
import { z } from "zod";

type ProfileSchema = {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
};

export const OAuthGoogleCallback = async (
    request: Request,
    response: Response,
) => {
    const { code, state } = request.query;

    const savedCodeVerifier = await redis.get<string>(
        `oauth_state:${state as string}`,
    );

    console.log("State from Google:", state);
    console.log("Verifier found in Redis:", savedCodeVerifier);

    if (!savedCodeVerifier) {
        return response
            .status(400)
            .send("State mismatch or session expired. Possible CSRF attack.");
    }

    await redis.del(`oauth_state:${state as string}`);

    try {
        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                    grant_type: "authorization_code",
                    code_verifier: savedCodeVerifier,
                }),
            },
        );

        const tokens: any = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error("Failed to exchange code");
        }

        const userResponse = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            },
        );

        const profile = await userResponse.json();

        const validatedProfile = ProfileSchema.safeParse(profile);
        if (!validatedProfile.success) {
            return response.status(400).json({
                success: false,
                message: "Invalid profile data",
                errors: z.flattenError(validatedProfile.error).fieldErrors,
            });
        }

        // Regular Authentication

        const existingGoogleUser = await prisma.account.findUnique({
            where: {
                provider_providerAccountID: {
                    provider: "google",
                    providerAccountID: validatedProfile.data.sub,
                },
            },
            include: { user: true },
        });

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedProfile.data.email },
        });

        let user;
        try {
            if (existingGoogleUser) {
                user = existingGoogleUser.user;
            } else {
                if (existingUser) {
                    await prisma.account.create({
                        data: {
                            provider: "google",
                            providerAccountID: validatedProfile.data.sub,
                            userId: existingUser.id,
                        }
                    });
                    user = existingUser;
                } else {
                    user = await prisma.user.create({
                        data: {
                            email: validatedProfile.data.email,
                            username: validatedProfile.data.name,
                            emailVerified: true,
                            accounts: {
                                create: {
                                    provider: "google",
                                    providerAccountID: validatedProfile.data.sub,
                                    
                                }
                            }
                        }
                    });
                }
            }
            const accessToken = await createAccessToken({
                    userId: user.id,
                    email: user.email,
                    tokenType: "access",
                });

                const refreshToken = await createAccessToken({
                    userId: user.id,
                    email: user.email,
                    tokenType: "refresh",
                });

                response.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    path: "/",
                });

                return response.redirect(`http://localhost:5173/oauth-success#access_token=${accessToken}`);

        } catch (error) {
            return response.status(500).json({
                success: false,
                message: "Database error: " + error,
            });
        }

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Failed to exchange code: " + error,
        });
    }
};

// {
//   sub: '104912143705599335569',
//   name: 'Raam Prashath T',
//   given_name: 'Raam Prashath',
//   family_name: 'T',
//   picture: 'https://lh3.googleusercontent.com/a/ACg8ocIaALkylD0ueTaek9NqsJfC8P4HcwGIj0pfOIvCAGqpqVHTfQ=s96-c',
//   email: 'raamthiruna@gmail.com',
//   email_verified: true
// }
