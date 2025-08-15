import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { requireNextAuthSession } from '../middlewares/nextauth-session';

const router = Router();

router.get('/', productController.list);
// router.get('/:id', productController.getById);
router.post('/', requireNextAuthSession, productController.create);
// router.put('/:id', productController.update);
// router.delete('/:id', productController.remove);

export default router;


