import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { userService } from "../services/user.service";
import { formatSuccess } from "../utils/responseFormatter";
import { userAddressPayLoad, userAddressSchema } from "../validators/user.schema";

export const usercontroller = {

    async getUserAddress(req: Request, res: Response) {

        const userId = req.params.userId as string ?? null;

        if(!userId)
            throw new AppError(`Parametro ingresado (${userId}) no es valido`, 400);

        const userAddress = await userService.findUserAddress(userId);

        res.status(200).json(formatSuccess(userAddress));
    },

    async setUserAddress(req: Request, res: Response) {
        
        const parse = userAddressSchema.safeParse(req.body)
        
        if( !parse.success )
            throw new AppError('Validation error', 400, parse.error);

        const payload = parse.data as userAddressPayLoad;
        const userAddress = await userService.storeOrUpdateUserAddress(payload);

        res.status(200).json(formatSuccess(userAddress));
    }
}