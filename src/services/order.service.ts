import { Order } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { orderRepository } from "../repositories/order.repository";
import { productRepository } from "../repositories/product.repository";
import { AppError } from "../utils/AppError";

export const orderService = {

    async setOrder(userId, payload) {
        
        const { address, products } = payload;
        
        const productsOrdered = await productRepository.findMany({
            where: {
                id: {
                    in: products.map((p: any) => p.id)
                }
            }
        })
    
        const itemsInOrder = products.reduce((total: number, p: any) => total + p.quantity, 0);
        
        const totals = products.reduce((totals: any, p: any) => {
            const quantity = p.quantity;
            const product = productsOrdered.find(product => product.id === p.id );
    
            if( !product )
                throw new Error(`${p.id} no existe`);
            
            const subTotal = quantity * Number(product.price);
    
            totals.subtotal += subTotal
            totals.tax += subTotal * 0.15;
            totals.total += subTotal * 1.15;            
                    
            return totals; 
        }, { subtotal: 0, tax: 0, total: 0 });
        
        try {
            const prismaTx = await prisma.$transaction(async(tx) => {
    
                // const productsUpdatePromises = productsOrdered.map(product => {
                //     const quantityOrdered = products.filter(p => p.productId === product.id)
                //                                         .reduce((acc: number, item: any) => acc + item.quantity, 0);
    
                //     if( quantityOrdered === 0 )
                //         throw new Error(`${product.id} no tiene una cantidad valida`);
    
                //     return tx.product.update({
                //         where: {
                //             id: product.id
                //         },
                //         data: {
                //             inStock: {
                //                 decrement: quantityOrdered
                //             }
                //         }
                //     });
                // });
    
                // const updatedProducts = await Promise.all(productsUpdatePromises);
    
                // updatedProducts.forEach(product => {
                //     if( product.inStock < 0 )
                //         throw new Error(`${product.title} no tiene inventario suficiente`);
                // });
    
                const order = await orderRepository.create({
                                        userId: userId,
                                        subTotal: totals.subtotal,
                                        tax: totals.tax,
                                        total: totals.total,
                                        itemsInOrder: itemsInOrder,
                                        orderItems: products.map(p => ({
                                                        productId: p.id,
                                                        quantity: p.quantity,
                                                        size: p.size,
                                                        price: productsOrdered.find(product => product.id === p.id)!.price
                                                    }))                            
                                    }, tx);
    
                const { countryId, id, ...rest } = address;        
                
                const orderAddress = await orderRepository.createOrderAddress({
                                                ...rest,
                                                orderId: order.id,
                                                countryId: countryId!                    
                                            }, tx);
    
                return {
                    // updatedProducts,
                    order,
                    orderAddress
                };
            });
    
            return {
                ok: true,
                data: { ...prismaTx }
            };
        } catch (error: any) {
            return {
                ok: false,
                message: error?.message
            }
        }
    },

    async findById(userId: string, id: string): Promise<{ ok: boolean; data?: { order: Order | null }; message?: string }> {
        
        try {
            const order = await orderRepository.findById(id);

            if( !order )
                throw new AppError(`${id} no existe`);

            if( order.userId !== userId )
                throw new AppError('Unauthorized for this resource', 401);

            return {
                ok: true,
                data: { order }
            };
        } catch (error: any) {
            return {
                ok: false,
                message: error?.message
            }
        }
	},
}