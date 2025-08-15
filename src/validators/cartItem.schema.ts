import { z } from 'zod';

export const cartItemSchema = z.object({
    productId: z.number().min(1),
    quantity: z.number().int().min(1)
});

export const updateCartItemSchema = z.object({
    id: z.string().min(1),
    quantity: z.number().int().min(1)
});

export type addCartItemPayload = z.infer<typeof cartItemSchema>;
export type updateCartItemPayload = z.infer<typeof updateCartItemSchema>;