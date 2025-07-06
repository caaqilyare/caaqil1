"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleWare = void 0;
exports.ErrorMiddleWare = {
    NotFound: (req, res, next) => {
        const error = new Error(`Not found - ${req.originalUrl}`);
        res.status(404);
        next(error);
    },
    ErrorHandler: (err, req, res, next) => {
        let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        let message = err.message;
        if (err.name === "CastError") {
            statusCode = 404;
            message = "Resource not found";
        }
        res.status(statusCode).json({
            message,
            stack: process.env.NODE_ENV === "production"
                ? 'Contact Munasar Abuukar'
                : err.stack
        });
    },
};
