import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserJwt {
    id: number,
    username: String,
    email: String,
    role_id: number
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return
    }

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY ?? "") as UserJwt;

        req.id = payload.id
        next();
    } catch (error) {
    }
}