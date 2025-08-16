import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { errorHandler } from './middlewares/errorHandler';
import { env } from './config/env';

// import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import productRoutes from './routes/product.routes';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = env.port;

app.use(express.json());// 
app.use(cookieParser());

app.get('/', (_req: Request, res: Response) => {
	res.json({ message: 'API up (TS)' });
});

app.use('/api/products', productRoutes);
// app.use('/auth', authRoutes);
app.use('/api/cart', cartRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});


