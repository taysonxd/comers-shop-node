import { productRepository } from '../repositories/product.repository';
import { Product } from '../interfaces/product';

export const productService = {
	async listProducts(params: {
		page?: number;
		limit?: number;
		sort?: string; // e.g., "price:asc" or "price:desc"
		q?: string;
		minPrice?: number;
		maxPrice?: number;
		category?: string;
	}) {
		const page = params.page && params.page > 0 ? params.page : 1;
		const limit = params.limit && params.limit > 0 ? params.limit : 12;
		const skip = (page - 1) * limit;
		const orderBy = params.sort
			? (() => {
				const [field, direction] = params.sort.split(':');
				return { [field]: (direction === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc' } as any;
			})()
			: { price: 'desc' } as any;

		const where: any = {};

        if (params.q)
            where.OR = [
                { title: { contains: params.q, mode: 'insensitive' } },
                { description: { contains: params.q, mode: 'insensitive' } },
            ];        

        if (params.category) {
            const map: Record<string, string> = {
                "men's clothing": 'men_s_clothing',
                "women's clothing": 'women_s_clothing',
                electronics: 'electronics',
                jewelery: 'jewelery',
            };
            const mapped = map[params.category] ?? params.category;
            where.category = mapped;
        }

		if (params.minPrice !== undefined || params.maxPrice !== undefined) {
			where.price = {};
			if (params.minPrice !== undefined) where.price.gte = params.minPrice;
			if (params.maxPrice !== undefined) where.price.lte = params.maxPrice;
		}
		
		const [items, total] = await Promise.all([
			productRepository.findMany({ where, orderBy, skip, take: limit }),
			productRepository.count({ where }),
		]);

		return { items, total, page, limit };
	},

	async getProductById(id: string) {
		return productRepository.findById(id);
	},

	async createProduct(data: any) {
		// Aquí podrías validar reglas de negocio
		return productRepository.create(data);
	},

	async updateProduct(id: string, data: any) {
		return productRepository.update(id, data);
	},

	async deleteProduct(id: string) {
		return productRepository.delete(id);
	},
};


