import z from "zod";

export const userAddressSchema = z.object({    
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(1),
    address2: z.string().optional(),
    postalCode: z.string().min(1),
    city: z.string().min(1),
    countryId: z.string().min(1),
    phone: z.string().min(1),
    userId: z.string().min(1)
})

export type userAddressPayLoad = z.infer< typeof userAddressSchema >