import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';
import { addCartItemPayload, cartItemSchema, updateCartItemPayload, updateCartItemSchema } from '../validators/cartItem.schema';

export const cartController = {

	// GET /cart
	async get(req: Request, res: Response) {				
		const userId = req.query.userId as string ?? null;
		
		const cart = await cartService.getCartItems(userId);
		res.status(201).json(cart);
	},

	// PUT /cart
	async update(req: Request, res: Response) {
						
		const parse = updateCartItemSchema.safeParse(req.body);

		if( !parse.success)
			return res.status(400).json({ message: 'Validation error', errors: parse.error.flatten() });
		
		const { id, quantity } = req.body as updateCartItemPayload;
		const cartItem = await cartService.updateCartItem(id, quantity);

		res.status(201).json(cartItem);
	},

	// POST /cart
	async add(req: Request, res: Response) {
										
		const parse = cartItemSchema.safeParse(req.body);

		if( !parse.success)
			return res.status(400).json({ message: 'Validation error', errors: parse.error.flatten() });
		
		const { productId, quantity } = req.body as addCartItemPayload;
		const cart = await cartService.addToCart(req.user!.id, productId, quantity);
		res.status(201).json(cart);
	},
	
	// DELETE /cart/:productId
	async remove(req: Request, res: Response) {
		await cartService.removeFromCart(req.params.itemId);
		res.status(204).send();
	},
};


