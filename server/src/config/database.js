const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on('error', (err) => {
            logger.error({ err }, 'MongoDB connection error');
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

    } catch (error) {
        logger.error({ error: error.message }, 'Error connecting to MongoDB');
        process.exit(1);
    }
};

const closeDB = async () => {
    try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');
    } catch (error) {
        logger.error({ error: error.message }, 'Error closing MongoDB connection');
    }
};

const isConnected = () => {
    return mongoose.connection.readyState === 1;
};

module.exports = { connectDB, closeDB, isConnected };
