import { z } from 'zod';

export const SignInSchema = z.object({
    email: z.string().trim().min(1, "Email is reqired").email(),
    password: z.string().min(1, "Password is required"),
});