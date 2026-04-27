import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

export const authController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, name } = req.body;
            const user = await authService.register(email, password, name);
            res.status(201).json({ status: 'success', data: user });
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const session = await authService.login(email, password);
            res.status(200).json({ status: 'success', data: session });
        } catch (error) {
            next(error);
        }
    },

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            await authService.logout();
            res.status(200).json({ status: 'success', message: 'Logged out successfully' });
        } catch (error) {
            next(error);
        }
    },

    async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await authService.getCurrentUser();
            res.status(200).json({ status: 'success', data: user });
        } catch (error) {
            next(error);
        }
    }
};
