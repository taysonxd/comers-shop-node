import { User } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const authRepository = {

  async userUpsert ({ email, name, picture }: {email?: string, name?: string, picture?: string}):Promise<User> {
    return await prisma.user.upsert({
      where: { email },
      update: { name, image: picture },
      create: { email: email!, name, image: picture },
    });
  },

  async accountUpsert (sub: string, idToken: string, user: User, provider: 'google') {
    return await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: sub,
        },
      },
      update: { access_token: idToken },
      create: {
        userId: user.id,
        provider,
        type: 'oauth',
        providerAccountId: sub,
        access_token: idToken,
      },
    });
  },
  
  async generateRefreshToken (userId: string, token: string) {
        
    await prisma.refreshToken.deleteMany({ where: { userId } });
  
    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    
    return token;
  },

  async revokeRefreshToken (token: string) {
    return prisma.refreshToken.delete({ where: {  token } });
  }
};