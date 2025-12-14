const ApiError = require('../utils/apiError');
const { logger } = require('../utils/logger');
const mongoose = require('mongoose');
const { ZodError } = require('zod');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error ? 400 : 500;
        const message = error.message || 'Something went wrong';
        error = new ApiError(statusCode, message, [], err.stack);
    }

    // Mongoose Bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new ApiError(404, message);
    }

    // Mongoose Duplicate Key
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new ApiError(400, message);
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new ApiError(400, message.join(', '));
    }

    // JWT Error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Json Web Token is invalid, try again';
        error = new ApiError(401, message);
    }

    // JWT Expired Error
    if (err.name === 'TokenExpiredError') {
        const message = 'Json Web Token is expired, try again';
        error = new ApiError(401, message);
    }

    // Multer Error
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            error = new ApiError(400, 'File too large');
        } else {
            error = new ApiError(400, err.message);
        }
    }

    const response = {
        ...error.toJSON(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };

    logger.error({
        message: error.message,
        statusCode: error.statusCode,
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        stack: error.stack,
    }, 'Error Handler');

    res.status(error.statusCode).json(response);
};

const notFoundHandler = (req, res, next) => {
    const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
    next(error);
};

const asyncErrorBoundary = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncErrorBoundary,
};
