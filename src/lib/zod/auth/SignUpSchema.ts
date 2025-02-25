import { z } from 'zod';

export const SignUpSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email().min(1, "Email is required"),
    password: z.string().min(8, "Minimum 8 characters"),
});