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
    SHORT: 60,
    MEDIUM: 300,
    LONG: 600,
    HOUR: 3600,
    DAY: 86400,
};

const CACHE_KEYS = {
    PROJECTS: 'projects',
    BLOGS: 'blogs',
    SKILLS: 'skills',
    CERTIFICATES: 'certificates',
    HERO: 'hero',
    LEETCODE: 'leetcode',
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
