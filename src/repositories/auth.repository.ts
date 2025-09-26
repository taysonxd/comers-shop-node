import { Prisma, PrismaClient, RefreshToken, User } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { createAccessJwt, createRefreshJwt, verifyJwt } from "../utils/jwt";
import { PrismaClients, PrismaTransactionClient } from "../interfaces/prisma.interface";

type UserWithTokens = Prisma.UserGetPayload<{
  include: {
    refreshTokens: true
  }
}>;
interface AuthRepository {
  prismaClient: PrismaClients;
  setClient: (tx: PrismaTransactionClient) => void
  getClient: () => PrismaTransactionClient | null;
  generateTokens: (user: { id: string; email: string }) => any;
  refreshAccessToken: (refreshToken: string) => any;
  // generateTokens: (user: { id: string; email: string }) => { accessToken: string, refreshToken: string };
  // refreshAccessToken: (refreshToken: string) => { accessToken: string, refreshToken: string };
  userAccountUpsert: (
    userData: {email?: string, name?: string, picture?: string},
    accountData: { sub: string, provider: string }
  ) => Promise<{ accessToken: string, refreshToken: string, user: User }>;
  userUpsert: (user: {email?: string, name?: string, picture?: string}) => Promise<UserWithTokens>;
  accountUpsert: (sub: string, access_token: string, user: User, provider: string) => void;
  // searchRefreshToken: (token: string) => Prisma.RefreshTokenGetPayload<{ include: { user: true }}> | null;
  searchRefreshToken: (token: string) => Promise<any>;
  storeRefreshToken: (userId: string, token: string) => void;
  revokeRefreshToken: (param: { token?: string; userId?: string }) => Promise<Boolean | undefined>
}

export const authRepository: AuthRepository = {

  prismaClient: prisma,
  setClient(tx) {
    this.prismaClient = tx
  },
  getClient() {
    return this.prismaClient
  },

  async generateTokens(user: { id: string; email: string }) {
        
    const refreshToken = createRefreshJwt(user);
    const accessToken = createAccessJwt(user);

    return { accessToken, refreshToken };
  },

  async refreshAccessToken(refreshToken: string) {
    const tokenData = await this.searchRefreshToken(refreshToken);
    
    if( !tokenData )
      throw new AppError('Token invalid', 400);
    
    const { user } = tokenData    
    await this.revokeRefreshToken({ token: refreshToken });
    
    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(user);
    
    return { accessToken, refreshToken: newRefreshToken };    
  },

  async userAccountUpsert(userData, accountData) {
        
    const { email, name, picture } = userData;
    const { sub, provider } = accountData;

    const prismaTx = await prisma.$transaction( async (tx) => {
      this.setClient(tx);

      const user = await this.userUpsert({ email, name, picture });
      const { token = '' } = user.refreshTokens[0] ?? {};    
      
      const { accessToken, refreshToken } = !verifyJwt(token) && !user.refreshTokens.length
        ? await this.generateTokens(user)
        : await this.refreshAccessToken(token);

      await this.storeRefreshToken(user.id, refreshToken);
      await this.accountUpsert(sub, accessToken, user, provider);

      return {
        accessToken,
        refreshToken,
        user
      }
    })

    return {
      ...prismaTx
    }
  },

  async userUpsert ({ email, name, picture }) {
        
    return await this.prismaClient.user.upsert({
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

  async accountUpsert (sub: string, access_token: string, user: User, provider: string) {
    return await this.prismaClient.account.upsert({
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
  
  async searchRefreshToken(token) {
        
    const tokenData = await this.prismaClient.refreshToken.findUnique({
      where: {
        token
      },
      include:{
        user: true
      }
    })

    return tokenData;
  },

  async storeRefreshToken (userId: string, token: string) {    
  
    return await this.prismaClient.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  },

  async revokeRefreshToken ({token, userId }) {
    try {

        await this.prismaClient.refreshToken.deleteMany({
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