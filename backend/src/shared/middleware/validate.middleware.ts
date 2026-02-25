import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { z } from "zod";

export const validate =
    (schema: ZodType) =>
    (request: Request, response: Response, next: NextFunction): void => {
        const validatedData = schema.safeParse(request.body);
        if (!validatedData.success) {
            response.status(400).json({
                message: "Validation failed",
                errors: z.flattenError(validatedData.error).fieldErrors,
            })
        }
        request.body = validatedData.data;
        next();
    };
