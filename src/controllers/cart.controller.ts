import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';
import { addCartItemPayload, cartItemSchema, updateCartItemPayload, updateCartItemSchema } from '../validators/cartItem.schema';
import { AppError } from '../utils/AppError';
import { formatSuccess } from '../utils/responseFormatter';

export const cartController = {

	// GET /cart
	async get(req: Request, res: Response) {				
		const userId = req.query.userId as string ?? null;
				
		const cart = await cartService.getCartItems(userId);
										
		res.status(201).json(formatSuccess(cart));
	},

	// PUT /cart
	async update(req: Request, res: Response) {
						
		const parse = updateCartItemSchema.safeParse(req.body);
				
		if( !parse.success)
			throw new AppError("Validation error", 400, parse.error);			
		
		const { id, quantity } = req.body as updateCartItemPayload;
		const cartItem = await cartService.updateCartItem(id, quantity);

		res.status(201).json(formatSuccess(cartItem));
	},

	// POST /cart
	async add(req: Request, res: Response) {
																
		const parse = cartItemSchema.safeParse(req.body);
										
		if( !parse.success)
			throw new AppError("Validation error", 400, parse.error);
				
		const { productId, quantity } = req.body as addCartItemPayload;
				
		const cart = await cartService.addToCart(req.user!.id, productId, quantity);
		
		res.status(201).json(formatSuccess(cart));
	},
	
	// DELETE /cart/:productId
	async remove(req: Request, res: Response) {		
		const response = await cartService.removeFromCart(req.params.itemId);
				
		if( !response )
			throw new AppError("Article not found", 404);			

		res.status(200).json(formatSuccess(true));		
	},
};


