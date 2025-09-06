import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AppError } from '../utils/AppError';
import { formatSuccess } from '../utils/responseFormatter';

export const authController = {

  async signinGoogleProvider(req: Request, res: Response) {
    const { idToken } = req.body;
        
    if (!idToken)
      throw new AppError("Missing idToken", 400);

    const { accessToken, refreshToken, user } = await authService.googleAuthFlow(idToken);
         
    res.status(200).json(formatSuccess({user, refreshToken, accessToken}));
  },

  async signout(req: Request, res: Response) {
    const refreshToken = req.cookies?.['refresh_token'];
  
    if (!refreshToken)
      throw new AppError('No refresh token provided', 400);

    await authService.handleSignOut(refreshToken);

    return res.status(204).json(formatSuccess(true));    
  }
}
