import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthUser {
	id: string;
	email: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: AuthUser;
		}
	}
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	const token = authHeader.substring('Bearer '.length);
	try {
		const payload = jwt.verify(token, env.jwtSecret) as AuthUser;
		req.user = payload;
		return next();
	} catch {
		return res.status(401).json({ message: 'Invalid token' });
	}
}


