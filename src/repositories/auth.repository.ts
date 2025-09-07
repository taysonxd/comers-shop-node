import { Prisma, User } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

type UserWithTokens = Prisma.UserGetPayload<{
  include: {
    refreshTokens: true
  }
}>;

export const authRepository = {

  async userUpsert ({ email, name, picture }: {email?: string, name?: string, picture?: string}):Promise<UserWithTokens> {
    return await prisma.user.upsert({
      where: { email },
      update: {
        name,
        image: picture
      },
      create: {
        email: email!,
        name,
        image: picture
      },
      include: {
        refreshTokens: true
      }
    });
  },

  async accountUpsert (sub: string, access_token: string, user: User, provider: 'google') {
    return await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: sub,
        },
      },
      update: { access_token },
      create: {
        userId: user.id,
        provider,
        type: 'oauth',
        providerAccountId: sub,
        access_token,
      },
    });
  },
  
  async storeRefreshToken (userId: string, token: string) {    
  
    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    
    return true;
  },

  async revokeRefreshToken ({token, userId }: { token?: string; userId?: string }) {
    try {

        await prisma.refreshToken.deleteMany({
          where: {
            OR: [
              {token},
              {userId}
            ]
          }
        });
      
      return true;
    } catch (error: any) {
      console.error(error);
      if( error.code === 'P2025' ) {
        throw new AppError("token not found in database", 404);
      }
    }    
  }
};