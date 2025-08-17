import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';
import jwt from 'jsonwebtoken';
import { formatError } from '../utils/responseFormatter';

export async function requireNextAuthSession(req: Request, res: Response, next: NextFunction) {
	const accessToken = req.cookies['access-token'];
	const refreshToken = req.cookies['refresh-token'];	
		
		
	if (!accessToken && !refreshToken)
		return res.status(401).json(formatError({ message: 'Unauthorized' }, 401));
	
	let payload: any;

	try {
		const validateToken = refreshToken ?? accessToken;				
		payload = jwt.verify(validateToken, env.jwtSecret);
	} catch (err) {				
		return res.status(401).json(formatError({ message: 'Invalid or expired token' }, 401));
	}

	// Buscar el usuario en la tabla account
	const account = await prisma.account.findFirst({
		where: { userId: payload.sub },
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


