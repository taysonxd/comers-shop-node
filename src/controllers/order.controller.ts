import { Request, Response } from "express";
import { findOneSchema, placeOrderPayload, placeOrderSchema } from "../validators/order.schema";
import { AppError } from "../utils/AppError";
import { orderService } from "../services/order.service";
import { formatSuccess } from "../utils/responseFormatter";

export const orderController = {

    async store(req: Request, res: Response) {

        const parsed = placeOrderSchema.safeParse(req.body);

        if( !parsed.success )
            throw new AppError('Validation error', 400, parsed.error);

        const payload = parsed.data as placeOrderPayload;
        const userId = req.user?.id;

        const { ok, data, message } = await orderService.setOrder(userId, payload);
        
        if( !ok )
            throw new AppError('Server error', 500, message);

        res.status(201).json(formatSuccess(data));
    },

    async findOne(req: Request, res: Response) {

        const parsed = findOneSchema.safeParse(req.params);

        if( !parsed.success )
            throw new AppError('Validation error', 400, parsed.error);

        const { id } = parsed.data;
        const userId = req.user!.id;

        const { ok, data, message } = await orderService.findById(userId, id);
        
        if( !ok )
            throw new AppError('Server error', 500, message);

        res.status(200).json(formatSuccess(data));
    }
}