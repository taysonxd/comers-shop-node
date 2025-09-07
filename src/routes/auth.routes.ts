import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authController } from '../controllers/auth.controller';
import { requireNextAuthSession } from '../middlewares/nextauth-session';

const router = Router();

router.post('/google', asyncHandler(authController.signinGoogleProvider));
router.post('/refresh_access_token', asyncHandler(authController.refreshAccessToken));
router.post('/signOut', requireNextAuthSession, asyncHandler(authController.signout));

export default router;
