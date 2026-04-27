import { Request, Response, NextFunction } from 'express';
import ClientError from '../utils/ClientError';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ClientError) {
        return res.status(err.statusCode).json({
            status: 'fail',
            message: err.message,
        });
    }

    console.error(err); // Log the error for debugging purposes

    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};

export default errorHandler;
