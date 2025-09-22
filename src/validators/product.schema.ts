import { z } from 'zod';

export const productCreateSchema = z.object({
	title: z.string().min(1),
	price: z.number().positive(),
	description: z.string().min(1),
	category: z.enum(["electronics", "jewelery", "men_s_clothing", "women_s_clothing"]),
	image: z.string().url(),
	rating: z.object({ rate: z.number().min(0), count: z.number().int().min(0) }),
});

const validationDigits = { message: 'Debe contener solo dígitos' };
export const productFilterSchema = z.object({
	page: z.string().regex(/^\d+$/, validationDigits).optional(),
	limit: z.string().regex(/^\d+$/, validationDigits).optional(),
	sort: z.enum(["price:asc", "price:desc"]).optional(),
	q: z.string().optional(),
	minPrice: z.string().regex(/^\d+$/, validationDigits).optional(),
	maxPrice: z.string().regex(/^\d+$/, validationDigits).optional(),
	category: z.string().optional(),
});

export const productIdSchema = z.object({
	id: z.string().min(1)
});

export type ProductCreatePayload = z.infer<typeof productCreateSchema>;
export type ProductFilterPayload = z.infer<typeof productFilterSchema>;
export type ProductIdPayload = z.infer<typeof productIdSchema>


