import { prisma } from '../lib/prisma';

export const cartRepository = {
	async add(userId: string, productId: number, quantity: number) {				
		return await prisma.cartItem.create({			
			data: { userId, productId, quantity },
			include: {
				product: true
			}
		});		
	},

	async update(id: string, quantity: number) {				
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

	async getCartItems(userId: string | null) {

		let queryOptions = {}

		if( userId )
			queryOptions = { where: { userId } };

		const cartItem = await prisma.cartItem.findMany({ ...queryOptions, include: { product: true }, orderBy: { id: 'asc' } });

		return cartItem ?? [];
	},

	async getCartItemById(id: string) {
		const cartItem = await prisma.cartItem.findUnique({
			where: { id }
		});

		return cartItem;
	},

	async getCartItem(userId: string, productId: number) {
		const cartItem = await prisma.cartItem.findUnique({
			where: { userId, productId },
			include: {
				product: true
			}
		});

		return cartItem;
	},

	async remove( itemId: string) {
		const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId } });
				
		if (!cartItem) return;
		
		return await prisma.cartItem.delete({ where: { id: itemId } });
	},
};


