import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { requireNextAuthSession } from '../middlewares/nextauth-session';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.get('/', asyncHandler(productController.list));
// router.get('/:id', productController.getById);
router.post('/', requireNextAuthSession, asyncHandler(productController.create));
// router.put('/:id', productController.update);
// router.delete('/:id', productController.remove);

export default router;


