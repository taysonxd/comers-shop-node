import { OAuth2Client } from "google-auth-library";

import { createAccessJwt, createRefreshJwt, verifyJwt } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { authRepository } from "../repositories/auth.repository";
import jwt from 'jsonwebtoken';
import { env } from "../config/env";

export const authService = {
  
  async generateTokens(user: { id: string; email: string }) {
        
    const refreshToken = createRefreshJwt(user);
    const accessToken = createAccessJwt(user);
    
    await authRepository.storeRefreshToken(user.id, refreshToken);    

    return { accessToken, refreshToken };
  },

  async refreshAccessToken(user: { id: string; email: string }, refreshToken: string) {    	    
    await authRepository.revokeRefreshToken({ token: refreshToken });
    
    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(user);

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
  
    const user = await authRepository.userUpsert({ email, name, picture });
    await authRepository.accountUpsert(sub, idToken, user, 'google');
        
    const { token = '' } = user.refreshTokens[0] ?? {};    
    const { accessToken, refreshToken } = !verifyJwt(token) && !user.refreshTokens
      ? await this.generateTokens(user)
      : await this.refreshAccessToken(user, token);
        
    return { accessToken, refreshToken, user };    
  },

  async handleSignOut (refreshToken: string) {    
    await authRepository.revokeRefreshToken({ token: refreshToken });

    return true;
  }
}


