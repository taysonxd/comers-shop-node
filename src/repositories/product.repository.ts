import { Prisma, Product } from '@prisma/client';
import { prisma } from '../lib/prisma';
import type { Rating } from '../interfaces/product';

export const productRepository = {
	async findAll(): Promise<Product[]> {
		return prisma.product.findMany();
	},

	async findMany(args: { where?: any; orderBy?: any; skip?: number; take?: number }): Promise<Product[]> {
		return prisma.product.findMany(args as any);
	},

	async count(args: { where?: any }): Promise<number> {
		return prisma.product.count(args as any);
	},

	async findById(id: string): Promise<Product | null> {
		const numericId = Number(id);
		
		if (Number.isNaN(numericId)) return null;
		return prisma.product.findUnique({ where: { id: numericId } });
	},

	async create(data: { title: string; price: number; description: string; category: string; image: string; rating: Rating }): Promise<Product> {
		return prisma.product.create({
			data: {
				title: data.title,
				description: data.description,
				price: new Prisma.Decimal(data.price),
				category: data.category as any,
				image: data.image,
				rating: data.rating as unknown as Prisma.InputJsonValue,
			},
		});
	},

	async update(id: string, data: Partial<{ title: string; price: number; description: string; category: string; image: string; rating: Rating }>): Promise<Product | null> {
		try {
			const numericId = Number(id);
			if (Number.isNaN(numericId)) return null;
			return await prisma.product.update({
				where: { id: numericId },
				data: {
					title: data.title,
					description: data.description,
					price: data.price !== undefined ? new Prisma.Decimal(data.price) : undefined,
					category: data.category as any,
					image: data.image,
					rating: (data.rating as unknown as Prisma.InputJsonValue) ?? undefined,
				},
			});
		} catch {
			return null;
		}
	},

	async delete(id: string): Promise<boolean> {
		try {
			await prisma.product.delete({ where: { id: Number(id) } });
			return true;
		} catch {
			return false;
		}
	},
};


