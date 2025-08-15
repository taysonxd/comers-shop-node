import dotenv from 'dotenv';

dotenv.config();

export const env = {
	port: Number(process.env.PORT ?? 3001),
	jwtSecret: process.env.JWT_SECRET || 'change_this_dev_secret',
	googleClientId: process.env.GOOGLE_CLIENT_ID || '',
};


