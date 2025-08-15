import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { requireNextAuthSession } from '../middlewares/nextauth-session';

const router = Router();

router.get('/', cartController.get);
router.post('/', requireNextAuthSession, cartController.add);
router.put('/', requireNextAuthSession, cartController.update);
router.delete('/:itemId', requireNextAuthSession, cartController.remove);

export default router;


