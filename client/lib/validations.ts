import { z } from "zod";

// ==========================================
// Contact Form Validation
// ==========================================
export const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters")
        .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
    email: z
        .string()
        .email("Please enter a valid email address")
        .max(255, "Email must be less than 255 characters"),
    subject: z
        .string()
        .min(5, "Subject must be at least 5 characters")
        .max(200, "Subject must be less than 200 characters"),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(5000, "Message must be less than 5000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ==========================================
// Admin Login Validation
// ==========================================
export const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ==========================================
// Blog/Article Validation
// ==========================================
export const blogSchema = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters")
        .max(200, "Title must be less than 200 characters"),
    summary: z
        .string()
        .min(20, "Summary must be at least 20 characters")
        .max(500, "Summary must be less than 500 characters"),
    content: z
        .string()
        .min(100, "Content must be at least 100 characters"),
    tags: z
        .array(z.string().max(30))
        .min(1, "At least one tag is required")
        .max(10, "Maximum 10 tags allowed"),
    image: z
        .string()
        .url("Please enter a valid image URL")
        .optional(),
    slug: z
        .string()
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
        .optional(),
});

export type BlogFormData = z.infer<typeof blogSchema>;

// ==========================================
// Project Validation
// ==========================================
export const projectSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(1000, "Description must be less than 1000 characters"),
    image: z
        .string()
        .url("Please enter a valid image URL"),
    tags: z
        .array(z.string().max(30))
        .min(1, "At least one tag is required")
        .max(10, "Maximum 10 tags allowed"),
    githubUrl: z
        .string()
        .url("Please enter a valid GitHub URL")
        .optional()
        .or(z.literal("")),
    liveUrl: z
        .string()
        .url("Please enter a valid live URL")
        .optional()
        .or(z.literal("")),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// ==========================================
// Certificate Validation
// ==========================================
export const certificateSchema = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters")
        .max(200, "Title must be less than 200 characters"),
    serialId: z
        .string()
        .min(2, "Serial ID must be at least 2 characters")
        .max(100, "Serial ID must be less than 100 characters"),
    image: z
        .string()
        .url("Please enter a valid image URL"),
});

export type CertificateFormData = z.infer<typeof certificateSchema>;

// ==========================================
// Experience Validation
// ==========================================
export const experienceSchema = z.object({
    company: z
        .string()
        .min(2, "Company name must be at least 2 characters")
        .max(100, "Company name must be less than 100 characters"),
    role: z
        .string()
        .min(2, "Role must be at least 2 characters")
        .max(100, "Role must be less than 100 characters"),
    period: z
        .string()
        .min(4, "Period must be specified")
        .max(50, "Period must be less than 50 characters"),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(1000, "Description must be less than 1000 characters"),
    tags: z
        .array(z.string().max(30))
        .min(1, "At least one tag is required")
        .max(10, "Maximum 10 tags allowed"),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

// ==========================================
// Skill Validation
// ==========================================
export const skillSchema = z.object({
    name: z
        .string()
        .min(1, "Skill name is required")
        .max(50, "Skill name must be less than 50 characters"),
    icon: z
        .string()
        .url("Please enter a valid icon URL")
        .optional()
        .or(z.literal("")),
    category: z
        .string()
        .max(50, "Category must be less than 50 characters")
        .optional(),
});

export type SkillFormData = z.infer<typeof skillSchema>;

// ==========================================
// Helper Functions
// ==========================================

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}

/**
 * Validate and parse form data with Zod schema
 */
export function validateForm<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors: Record<string, string> = {};
    result.error.errors.forEach((error) => {
        const path = error.path.join(".");
        errors[path] = error.message;
    });

    return { success: false, errors };
}
