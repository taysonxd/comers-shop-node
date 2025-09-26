import { Order } from "@prisma/client";
import { PrismaClients } from "../interfaces/prisma.interface";
import { prisma as prismaClient } from "../lib/prisma";

export const orderRepository = {

	async findAll(prisma: PrismaClients = prismaClient): Promise<Order[]> {
		return await prisma.order.findMany();
	},

	async findMany(args: { where?: any; orderBy?: any; skip?: number; take?: number }, prisma: PrismaClients = prismaClient): Promise<Order[]> {
		return await prisma.order.findMany(args as any);
	},

	async count(args: { where?: any }, prisma: PrismaClients = prismaClient): Promise<number> {
		return await prisma.order.count(args as any);
	},

	async findById(id: string, prisma: PrismaClients = prismaClient): Promise<Order | null> {		
		return await prisma.order.findUnique({ where: { id: id }, include: { OrderItem: true }});
	},

	async create(payload: { userId: string; subTotal: number; tax: number; total: number; itemsInOrder: number; orderItems: { productId: number; quantity: number; price: number }[] }, prisma: PrismaClients = prismaClient): Promise<Order> {
		return await prisma.order.create({
			data: {
				userId: payload.userId,
                subTotal: payload.subTotal,
                tax: payload.tax,
                total: payload.total,
                itemsInOrder: payload.itemsInOrder,
                OrderItem: {
                    createMany: {
                        data: payload.orderItems.map(p => ({
                            productId: p.productId,
                            quantity: p.quantity,                            
                            price: p.price
                        }))
                    }
                }
			},
		});
	},

	async createOrderAddress(payload: { firstName:  string; lastName: string; address: string; address2: string; postalCode: string; city: string; phone: string; countryId: string; orderId: string; }, prisma: PrismaClients = prismaClient) {				
		const orderAddress = await prisma.orderAddress.create({ data: payload });

		return orderAddress;
	},

	async update(id: string, data: Partial<{ title: string; price: number; description: string; category: string; image: string }>, prisma: PrismaClients = prismaClient): Promise<Order | null> {		
		const numericId = Number(id);

		if ( Number.isNaN(numericId) )
			return null;
		
		return await prisma.order.update({
			where: { id: numericId },
			data: {
				title: data.title,
				description: data.description,
				price: data.price !== undefined ? new Prisma.Decimal(data.price) : undefined,
				category: data.category as any,
				image: data.image,
				rating: (data.rating as unknown as Prisma.InputJsonValue) ?? undefined,
			},
		});		
	},

	async delete(id: string, prisma: PrismaClients = prismaClient): Promise<boolean> {		
		await prisma.order.delete({ where: { id: Number(id) } });
		
		return true
	},
};