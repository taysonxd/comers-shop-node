import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';
import jwt from 'jsonwebtoken';
import { formatError } from '../utils/responseFormatter';

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
			};
		}
	}
}

export async function requireNextAuthSession(req: Request, res: Response, next: NextFunction) {
	let accessToken = req.cookies['access_token'];
	const refreshToken = req.cookies['refresh_token'];	
	
	if (!accessToken && req.headers.authorization) {
		const parts = req.headers.authorization.split(' ');
		
		if (parts.length === 2 && parts[0] === 'Bearer')
			accessToken = parts[1];		
	}

	if (!accessToken && !refreshToken)
		return res.status(401).json(formatError({ message: 'Unauthorized' }, 401));
	
	let payload: any;
	
	try {
		
		const validateToken = refreshToken ?? accessToken;				
		payload = jwt.verify(validateToken, env.jwtSecret, { algorithms: ['HS256'] });
		console.log(payload);
		
	} catch (err) {						
		console.log({err, accessToken});		
		return res.status(401).json(formatError({ message: 'Invalid or expired token' }, 401));
	}
		
	const account = await prisma.account.findFirst({
		where: { userId: payload.userId },
		include: { user: true },
	});
		
	if (!account || !account.user)
		return res.status(404).json(formatError({ message: 'User not found' }, 404));
	
	req.user = {
		id: account.user.id,
		email: account.user.email || '',
	};

	return next();
}


