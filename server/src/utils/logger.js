const pino = require('pino');

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        },
    },
    redact: {
        paths: ['req.headers.authorization', 'req.body.password', 'req.body.token'],
        remove: true,
    },
    base: {
        env: process.env.NODE_ENV || 'development',
    },
});

const createChildLogger = (bindings) => {
    return logger.child(bindings);
};

const logRequest = (req) => {
    logger.info({
        method: req.method,
        url: req.url,
        ip: req.ip,
        query: req.query,
    }, 'Incoming Request');
};

module.exports = { logger, createChildLogger, logRequest };
