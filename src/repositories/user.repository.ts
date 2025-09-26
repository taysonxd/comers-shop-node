import { UserAddress } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { Address } from "../interfaces/address.interface";
import { PrismaClients, PrismaTransactionClient } from "../interfaces/prisma.interface";

interface UserRepository {
    prisma: PrismaClients;
    setPrismaTransactionClient: (tx: PrismaTransactionClient) => void
    getUserAddress: (data: any) => any,
    findById: (data: any) => any,
    findUserAddress: (data: any) => any,
    createUserAddress: (data: any) => any,
    updateUserAddress: (any: any, userId: string) => any,
}

export const userRepository: UserRepository = {
    prisma: prisma,
    setPrismaTransactionClient(tx: PrismaTransactionClient ) {
        this.prisma = tx;
    },

    async getUserAddress(userId: string): Promise<UserAddress | null> {
        return await this.prisma.userAddress.findUnique({ where: { userId }});
    },

    async findById(userId: string): Promise<UserAddress | null> {				
		return await this.prisma.userAddress.findUnique({ where: { userId } });
	},

    async findUserAddress(userId: string): Promise<UserAddress | null> {
        return await this.prisma.userAddress.findUnique({ where: { userId }});
    },

	async createUserAddress(data: Address): Promise<UserAddress> {
		return await this.prisma.userAddress.create({
			data: data
		});
	},

	async updateUserAddress(data: Address, userId: string): Promise<UserAddress> {		
		return await this.prisma.userAddress.update({
            where: { userId },
            data: data
        });
	},
}