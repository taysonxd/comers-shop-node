import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { productCreateSchema } from '../validators/product.schema';

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

		const result = await productService.listProducts({
			page: Number(page),
			limit: Number(limit),
			sort,
			q,
			minPrice: minPrice ? Number(minPrice) : undefined,
			maxPrice: maxPrice ? Number(maxPrice) : undefined,
			category,
		});
		res.json(result);
	},

	async getById(req: Request, res: Response) {
		const product = await productService.getProductById(req.params.id);
		if (!product) return res.status(404).json({ message: 'Product not found' });
		res.json(product);
	},

	async create(req: Request, res: Response) {
		const parse = productCreateSchema.safeParse(req.body);
		if (!parse.success) {
			return res.status(400).json({ message: 'Validation error', errors: parse.error.flatten() });
		}
		const created = await productService.createProduct(parse.data);
		res.status(201).json(created);
	},

	async update(req: Request, res: Response) {
		const updated = await productService.updateProduct(req.params.id, req.body);
		if (!updated) return res.status(404).json({ message: 'Product not found' });
		res.json(updated);
	},

	async remove(req: Request, res: Response) {
		const ok = await productService.deleteProduct(req.params.id);
		if (!ok) return res.status(404).json({ message: 'Product not found' });
		res.status(204).send();
	},
};


