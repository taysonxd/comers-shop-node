import { CartItem } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

export const cartRepository = {

	async add(userId: string, productId: number, quantity: number):Promise<CartItem> {				
		const cartItem = await prisma.cartItem.create({			
			data: { userId, productId, quantity },
			include: {
				product: true
			}
		});		

		return cartItem;
	},

	async update(id: string, quantity: number):Promise<CartItem> {				
		const cartItem = await prisma.cartItem.update({
			where: { id },
			data: {
				quantity
			},
			include: {
				product: true
			}
		});

		return cartItem;
	},

	async getCartItems(userId: string | null):Promise<CartItem[]> {

		let queryOptions = {}

		if( userId )
			queryOptions = { where: { userId } };

		const cartItems = await prisma.cartItem.findMany({ ...queryOptions, include: { product: true }, orderBy: { id: 'asc' } });

		return cartItems;
	},

	async getCartItemById(id: string):Promise<CartItem | null> {
		const cartItem = await prisma.cartItem.findUnique({
			where: { id }
		});

		return cartItem;
	},

	async getCartItem(userId: string, productId: number):Promise<CartItem | null> {
		const cartItem = await prisma.cartItem.findFirst({
			where: { userId, productId },
			include: {
				product: true
			}
		});

		return cartItem;
	},

	async remove( itemId: string): Promise<CartItem | undefined> {				
		try {			
			const result = await prisma.cartItem.delete({ where: { id: itemId } });

			return result;
		} catch (error: any) {
			if (error.code === 'P2025') {
				console.error(error);
				throw new AppError("Cart item not found", 404);
			}				
		}
	},
};


