import express, { Request, Response } from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
// import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import { env } from './config/env';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = env.port;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));
app.use(cookieParser());

app.get('/', (_req: Request, res: Response) => {
	res.json({ message: 'API up (TS)' });
});

app.use('/api/products', productRoutes);
// app.use('/auth', authRoutes);
app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});


