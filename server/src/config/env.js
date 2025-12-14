require('dotenv').config();
const { z } = require('zod');

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(5000),
    MONGODB_URI: z.string().url(),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('1d'),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    LEETCODE_USERNAME: z.string().optional(),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    CORS_ORIGINS: z.string().transform(str => str.split(',')).default('*'),
});

const validateEnv = () => {
    try {
        const parsed = envSchema.parse(process.env);
        return {
            ...parsed,
            getAllowedOrigins: () => parsed.CORS_ORIGINS,
        };
    } catch (error) {
        console.error('❌ Invalid environment variables:', error.errors);
        process.exit(1);
    }
};

const env = validateEnv();

module.exports = env;
