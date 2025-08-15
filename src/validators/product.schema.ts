import { z } from 'zod';

export const productCreateSchema = z.object({
	title: z.string().min(1),
	price: z.number().positive(),
	description: z.string().min(1),
	category: z.enum(["electronics", "jewelery", "men_s_clothing", "women_s_clothing"]),
	image: z.string().url(),
	rating: z.object({ rate: z.number().min(0), count: z.number().int().min(0) }),
});

export type ProductCreatePayload = z.infer<typeof productCreateSchema>;


