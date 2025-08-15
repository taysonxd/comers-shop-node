import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export async function requireNextAuthSession(req: Request, res: Response, next: NextFunction) {
	const token = req.cookies['__Secure-next-auth.session-token'] || req.cookies['next-auth.session-token'];
		
	if (!token) return res.status(401).json({ message: 'Unauthorized' });

	const session = await prisma.session.findUnique({
		where: { sessionToken: token },
		include: { user: true },
	});

	if (!session || session.expires < new Date()) {
		return res.status(401).json({ message: 'Session expired' });
	}

	req.user = { id: session.user.id, email: session.user.email || '' };
	return next();
}


