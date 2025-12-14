const { z } = require('zod');

// Common Schemas
const idParamSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId'),
});

const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Auth Schemas
const loginSchema = z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(6),
});

const registerSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(6),
});

// Project Schemas
const projectSchema = z.object({
    title: z.string().min(1).max(100).trim(),
    description: z.string().min(1).max(2000),
    technologies: z.union([
        z.array(z.string()),
        z.string().transform((str) => str.split(',').map((s) => s.trim())),
    ]).refine((val) => val.length > 0, 'At least one technology is required'),
    link: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    category: z.enum(['project', 'internship', 'job']),
    featured: z.boolean().or(z.string().transform((val) => val === 'true')).default(false),
    status: z.enum(['completed', 'in-progress', 'planned']).default('completed'),
});

const projectUpdateSchema = projectSchema.partial();

// Blog Schemas
const blogSchema = z.object({
    title: z.string().min(1).max(200).trim(),
    content: z.string().min(50),
    summary: z.string().max(300).optional(),
    tags: z.union([
        z.array(z.string()),
        z.string().transform((str) => str.split(',').map((s) => s.trim())),
    ]).default([]),
    published: z.boolean().default(false),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format').optional(),
});

const blogUpdateSchema = blogSchema.partial();

// Skill Schemas
const skillSchema = z.object({
    name: z.string().min(1).max(50),
    category: z.enum(['frontend', 'backend', 'database', 'devops', 'tools', 'languages', 'other']),
    proficiency: z.coerce.number().min(0).max(100).default(80),
    order: z.coerce.number().min(0).default(0),
});

const skillUpdateSchema = skillSchema.partial();

// Certificate Schemas
const certificateSchema = z.object({
    title: z.string().min(1).max(150),
    issuer: z.string().min(1).max(100),
    issueDate: z.coerce.date(),
    expiryDate: z.coerce.date().nullable().optional(),
    credentialId: z.string().max(100).optional(),
    credentialUrl: z.string().url().optional(),
    skills: z.array(z.string()).default([]),
});

const certificateUpdateSchema = certificateSchema.partial();

// Contact Schemas
const contactSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    message: z.string().min(20).max(2000),
    subject: z.string().min(5).max(150).optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
});

// Hero Schemas
const heroSchema = z.object({
    heroTitle: z.string().min(1).max(100),
    heroSubtitle: z.string().min(1).max(100),
    skills: z.array(z.object({
        name: z.string().min(1),
        icon: z.string().url()
    })),
    footerText: z.string().min(1),
    aboutTitle: z.string().min(1).max(100).optional().or(z.literal('')),
    aboutSubtitle: z.string().min(1).max(200).optional().or(z.literal('')),
    aboutDescription: z.string().min(50).max(2000).optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    socialLinks: z.object({
        github: z.string().url().optional().or(z.literal('')),
        linkedin: z.string().url().optional().or(z.literal('')),
        twitter: z.string().url().optional().or(z.literal('')),
        instagram: z.string().url().optional().or(z.literal('')),
        website: z.string().url().optional().or(z.literal('')),
    }).optional(),
});

const heroUpdateSchema = heroSchema.partial();

module.exports = {
    idParamSchema,
    paginationSchema,
    loginSchema,
    registerSchema,
    projectSchema,
    projectUpdateSchema,
    blogSchema,
    blogUpdateSchema,
    skillSchema,
    skillUpdateSchema,
    certificateSchema,
    certificateUpdateSchema,
    contactSchema,
    heroSchema,
    heroUpdateSchema,
};
