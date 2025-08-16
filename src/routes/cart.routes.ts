import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { requireNextAuthSession } from '../middlewares/nextauth-session';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.get('/', asyncHandler(cartController.get));
router.post('/', requireNextAuthSession, asyncHandler(cartController.add));
router.put('/', requireNextAuthSession, asyncHandler(cartController.update));
router.delete('/:itemId', requireNextAuthSession, asyncHandler(cartController.remove));

export default router;


