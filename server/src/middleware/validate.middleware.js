const { ZodError } = require('zod');
const ApiError = require('../utils/apiError');

const validate = (schema) => async (req, res, next) => {
    try {
        const parseable = {
            body: req.body,
            query: req.query,
            params: req.params,
        };

        // If schema is a Zod schema object directly (e.g. projectSchema), validate body
        // If it's an object with body/query/params keys, validate respective parts

        if (schema.parseAsync) {
            req.body = await schema.parseAsync(req.body);
            return next();
        }

        if (schema.body) {
            req.body = await schema.body.parseAsync(req.body);
        }
        if (schema.query) {
            const parsedQuery = await schema.query.parseAsync(req.query);
            // Express 5: req.query is getter, mutate object in place
            Object.keys(req.query).forEach(key => delete req.query[key]);
            Object.assign(req.query, parsedQuery);
        }
        if (schema.params) {
            const parsedParams = await schema.params.parseAsync(req.params);
            // Express 5: req.params is getter, mutate object in place
            Object.keys(req.params).forEach(key => delete req.params[key]);
            Object.assign(req.params, parsedParams);
        }

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errors = error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            next(ApiError.badRequest('Validation Error', errors));
        } else {
            next(error);
        }
    }
};

const validateBody = (schema) => validate({ body: schema });
const validateQuery = (schema) => validate({ query: schema });
const validateParams = (schema) => validate({ params: schema });

module.exports = {
    validate,
    validateBody,
    validateQuery,
    validateParams,
};
