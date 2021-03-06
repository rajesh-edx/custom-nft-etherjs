import expressValidation from "express-validation";
import httpStatus from 'http-status';
import { env } from '../../config/variables';
import APIError from '../../errors/api-error';
/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
    const response = {
        code: err.status,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack,
    };

    if (env !== 'development') {
        delete response.stack;
    }

    res.status(err.status);
    res.json(response);
};

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
const converter = (err, req, res, next) => {
    let convertedError = err;

    if (err instanceof expressValidation.ValidationError) {
        convertedError = new APIError({
            message: 'Validation Error',
            // @ts-ignore
            errors: err.errors,
            // @ts-ignore
            status: err.status,
            // @ts-ignore
            stack: err.stack,
        });
    } else if (!(err instanceof APIError)) {
        // @ts-ignore
        convertedError = new APIError({
            message: err.message,
            status: err.status,
            stack: err.stack,
        });
    }

    return handler(convertedError, req, res, next);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
const notFound = (req, res, next) => {
    // @ts-ignore
    const err = new APIError({
        message: 'Not found',
        status: httpStatus.NOT_FOUND,
    });
    return handler(err, req, res, next);
};

export const error = {
    handler,
    notFound,
    converter
}
