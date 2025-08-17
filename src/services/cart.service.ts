import { CartItem } from '@prisma/client';
import { cartRepository } from '../repositories/cart.repository';

export const cartService = {

	async addToCart(userId: string, productId: number, quantity: number):Promise<CartItem> {		
		const existingCartItem = await cartRepository.getCartItem(userId, productId);
		
		if( existingCartItem )		
			return await cartRepository.update(existingCartItem.id, existingCartItem.quantity + 1);

		return cartRepository.add(userId, productId, quantity);
	},

	async updateCartItem(id: string, quantity: number):Promise<CartItem | undefined> {
		const existingCartItem = await cartRepository.getCartItemById(id);
		
		if( !existingCartItem ) return;

		if( quantity == 0 ) return existingCartItem;
			
		return await cartRepository.update(existingCartItem.id, quantity);		
	},

	async getCartItems(userId: string | null):Promise<CartItem[]> {
		return cartRepository.getCartItems(userId);
	},

	async removeFromCart(itemId: string):Promise<CartItem | null> {				
		const cartItem = await cartRepository.getCartItemById( itemId );
								
		if (!cartItem)
			return null;

		return cartRepository.remove(itemId);
	},
};


