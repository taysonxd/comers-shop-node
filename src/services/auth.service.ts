import { OAuth2Client } from "google-auth-library";

import { createAccessJwt, createRefreshJwt } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { authRepository } from "../repositories/auth.repository";

export const authService = {

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
  
    const accessToken = createAccessJwt(user);
    const refreshToken = createRefreshJwt(user);
    
    await authRepository.storeRefreshToken(user.id, refreshToken);
  
    return { accessToken, refreshToken, user };
  },

  async handleSignOut (refreshToken: string) {    
    await authRepository.revokeRefreshToken(refreshToken);

    return true;
  }

}


