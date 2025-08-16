import dotenv from 'dotenv';

dotenv.config();

export const env = {
	nodeEnv: process.env.NODE_ENV,
	isProd: process.env.NODE_ENV === 'production',
	port: Number(process.env.PORT ?? 3001),
	jwtSecret: process.env.JWT_SECRET || '',
	googleClientId: process.env.GOOGLE_CLIENT_ID || '',
	databaseUrl: process.env.DATABASE_URL || '',
	frontDomain: process.env.FRONT_DOMAIN || 'http://localhost:3000'
};


