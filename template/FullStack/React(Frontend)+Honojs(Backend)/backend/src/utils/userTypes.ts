import z from 'zod';

export const signUpSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    name: z.string().min(1, "Name is required"),
    password: z.string().min(8, "Password must be at least 8 characters long")
})

export const signInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long")
})