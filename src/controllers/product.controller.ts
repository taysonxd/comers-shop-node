import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { productCreateSchema } from '../validators/product.schema';
import { AppError } from '../utils/AppError';
import { formatSuccess } from '../utils/responseFormatter';

export const productController = {
	async list(req: Request, res: Response) {
		const {
			page = '1',
			limit = '12',
			sort = 'price:desc',
			q,
			minPrice,
			maxPrice,
			category
		} = req.query as Record<string, string | undefined>;

		const products = await productService.listProducts({
			page: Number(page),
			limit: Number(limit),
			sort,
			q,
			minPrice: minPrice ? Number(minPrice) : undefined,
			maxPrice: maxPrice ? Number(maxPrice) : undefined,
			category,
		});
							
		res.status(201).json(formatSuccess(products));
	},

	async create(req: Request, res: Response) {
		const parse = productCreateSchema.safeParse(req.body);
		
		if( !parse.success)
			throw new AppError("Validation error", 400, parse.error);					
		
		const product = await productService.createProduct(parse.data);
		
		res.status(201).json(formatSuccess(product));
	},

};


