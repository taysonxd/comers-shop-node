import { CartItem } from '@prisma/client';
import { cartRepository } from '../repositories/cart.repository';
import { AppError } from '../utils/AppError';

export const cartService = {

	async addToCart(userId: string, productId: number, quantity: number): Promise<CartItem> {		
		const existingCartItem = await cartRepository.getCartItem(userId, productId);
		
		if( existingCartItem )		
			return await cartRepository.update(existingCartItem.id, existingCartItem.quantity + quantity);

		return cartRepository.add(userId, productId, quantity);
	},

	async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
		const existingCartItem = await cartRepository.getCartItemById(id);
		
		if( !existingCartItem )
			throw new AppError("Cart item not found", 404);
			
		if( quantity == 0 )
			throw new AppError("Quantity is invalid, must be greater than 0", 400);
			
		return await cartRepository.update(existingCartItem.id, quantity);		
	},

	async getCartItems(userId: string | null): Promise<CartItem[]> {
		return cartRepository.getCartItems(userId);
	},

	async removeFromCart(itemId: string): Promise<CartItem | null> {				
		const cartItem = await cartRepository.getCartItemById( itemId );
								
		if( !cartItem )
			throw new AppError("Cart item not found", 404);

		return cartRepository.remove(itemId);
	},
};


