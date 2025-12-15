const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};

const CACHE_TTL = {
    SHORT: 30,      // 30 seconds for dynamic content
    MEDIUM: 120,    // 2 minutes
    LONG: 300,      // 5 minutes
    HOUR: 600,      // 10 minutes (reduced from 1 hour)
    DAY: 3600,      // 1 hour (reduced from 1 day)
};

// Cache keys must match URL patterns for invalidation to work
const CACHE_KEYS = {
    PROJECTS: '/api/projects',
    BLOGS: '/api/blogs',
    SKILLS: '/api/skills',
    CERTIFICATES: '/api/certificates',
    HERO: '/api/hero',
    EXPERIENCES: '/api/experiences',
    LEETCODE: '/api/leetcode',
    ALL: '/api/',  // Matches all API routes
};

const RATE_LIMITS = {
    GENERAL: {
        points: 100,
        duration: 60,
    },
    AUTH: {
        points: 5,
        duration: 60,
    },
    CONTACT: {
        points: 3,
        duration: 300,
    },
    UPLOAD: {
        points: 10,
        duration: 60,
    },
};

const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};

const UPLOAD_LIMITS = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    ALLOWED_DOC_TYPES: ['application/pdf'],
};

const JWT_CONFIG = {
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '1d',
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '10d',
    COOKIE_MAX_AGE: 24 * 60 * 60 * 1000, // 1 day
};

module.exports = {
    HTTP_STATUS,
    CACHE_TTL,
    CACHE_KEYS,
    RATE_LIMITS,
    PAGINATION,
    UPLOAD_LIMITS,
    JWT_CONFIG,
};
