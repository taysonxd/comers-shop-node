import { cartRepository } from '../repositories/cart.repository';

export interface CartItem {
	productId: string;
	quantity: number;
}

export interface Cart {
	userId: string;
	items: CartItem[];
}

export const cartService = {
	async addToCart(userId: string, productId: number, quantity: number) {
		const existingCartItem = await cartRepository.getCartItem(userId, productId);
		
		if( existingCartItem )		
			return await cartRepository.update(existingCartItem.id, existingCartItem.quantity + 1);

		return cartRepository.add(userId, productId, quantity);
	},

	async updateCartItem(id: string, quantity: number) {
		const existingCartItem = await cartRepository.getCartItemById(id);
		
		if( !existingCartItem ) return;

		if( quantity == 0 ) return existingCartItem;
			
		return await cartRepository.update(existingCartItem.id, quantity);		
	},

	async getCartItems(userId: string | null) {
		return cartRepository.getCartItems(userId);
	},

	async removeFromCart(itemId: string) {				
		return cartRepository.remove(itemId);
	},
};


