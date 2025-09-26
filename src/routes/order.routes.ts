import { Router } from "express";
import { requireNextAuthSession } from "../middlewares/nextauth-session";
import { asyncHandler } from "../middlewares/asyncHandler";
import { orderController } from "../controllers/order.controller";


const router = Router();

router.post('/', requireNextAuthSession, asyncHandler(orderController.store));
router.get('/:id', requireNextAuthSession, asyncHandler(orderController.findOne));

export default router