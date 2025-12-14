const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Portfolio API',
            version: '1.0.0',
            description: 'API Documentation for Portfolio Backend',
            contact: {
                name: 'Developer',
            },
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}/api`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/router/*.js', './src/controllers/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
