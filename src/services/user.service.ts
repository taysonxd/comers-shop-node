import { userRepository } from "../repositories/user.repository";
import { Address } from "../interfaces/address.interface";
import { UserAddress } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export const userService = {
    async findUserAddress(userId: string): Promise<UserAddress | null>{
        return await userRepository.getUserAddress(userId);
    },

    async storeOrUpdateUserAddress(address: Address) {
        try {

            const { userId } = address;
            const prismaTx = await prisma.$transaction( async (tx) => {

                userRepository.setPrismaTransactionClient(tx);
                const addressFound = await userRepository.findUserAddress( userId );
        
                const { countryId, ...rest } = address;
                const newAddress = {
                    ...rest,                    
                    countryId
                }
        
                if( !addressFound ) {
                    const addressSaved = await userRepository.createUserAddress( newAddress )
                    return {
                        address: addressSaved
                    };
                }
        
                const addressUpdated = await userRepository.updateUserAddress( newAddress, userId );                
                return {
                    address: addressUpdated
                };
            });

            return prismaTx.address;
        } catch (error) {
            console.error(error);
            throw new AppError("No se pudo almacenar en la base de datos", 500);
        }
    }
}