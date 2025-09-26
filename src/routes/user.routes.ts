import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { usercontroller } from "../controllers/user.controller";
import { requireNextAuthSession } from "../middlewares/nextauth-session";

const router = Router()

router.get('/address/:userId', requireNextAuthSession, asyncHandler(usercontroller.getUserAddress));
router.post('/address', requireNextAuthSession, asyncHandler(usercontroller.setUserAddress));

export default router;