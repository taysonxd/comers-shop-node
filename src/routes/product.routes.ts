import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { requireNextAuthSession } from '../middlewares/nextauth-session';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.get('/', asyncHandler(productController.list));
router.get('/:id', asyncHandler(productController.show));
router.post('/', requireNextAuthSession, asyncHandler(productController.create));

export default router;


