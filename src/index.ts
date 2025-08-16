import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { errorHandler } from './middlewares/errorHandler';
import { env } from './config/env';

import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import productRoutes from './routes/product.routes';

const app = express();
const PORT = env.port;

app.use(cors({
	origin: env.frontDomain,
	credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
	res.json({ message: 'API up (TS)' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});


