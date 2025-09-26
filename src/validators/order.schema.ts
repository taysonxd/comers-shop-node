import z from "zod";

export const placeOrderSchema = z.object({
    address: z.object({                
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        address: z.string().min(1),
        address2: z.string().optional(),
        postalCode: z.string().min(1),
        city: z.string().min(1),
        countryId: z.string().min(1),
        phone: z.string().min(1) 
    }),
    products: z.array(z.object({
        id: z.number().min(1),
        quantity: z.number().min(1),
    })) 
});

export const findOneSchema = z.object({
    id: z.string().min(1)
});

export type placeOrderPayload = z.infer<typeof placeOrderSchema>