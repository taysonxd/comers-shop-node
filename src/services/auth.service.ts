import { OAuth2Client } from "google-auth-library";

import { AppError } from "../utils/AppError";
import { authRepository } from "../repositories/auth.repository";

export const authService = {
  
  async refreshAccessToken(refreshToken: string) {
    const tokenData = await authRepository.searchRefreshToken(refreshToken);
    
    if( !tokenData )
      throw new AppError('Token invalid', 400);
    
    const { user } = tokenData    
    await authRepository.revokeRefreshToken({ token: refreshToken });
    
    const { accessToken, refreshToken: newRefreshToken } = await authRepository.generateTokens(user);
    
    return { accessToken, refreshToken: newRefreshToken };    
  },

  async googleAuthFlow (idToken: string) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  
    const payload = ticket.getPayload();
    
    if (!payload)
      throw new AppError("Invalid Google token", 500);
  
    const { sub, email, name, picture } = payload;

    const {
      accessToken,
      refreshToken,
      user
    } = await authRepository.userAccountUpsert({ email, name, picture }, { sub, provider: 'google' });    
        
    return { accessToken, refreshToken, user };    
  },

  async handleSignOut (userId: string) {    
    await authRepository.revokeRefreshToken({ userId });

    return true;
  }
}


