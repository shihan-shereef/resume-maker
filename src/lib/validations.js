import { z } from 'zod';

/**
 * Zod schemas for form validation and API bodies
 */

export const profileSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    avatar_url: z.string().url().optional().or(z.literal('')),
});

export const passwordSchema = z.object({
    currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const userAdminSchema = z.object({
    role: z.enum(['user', 'moderator', 'admin']),
    status: z.enum(['active', 'suspended', 'pending']),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
