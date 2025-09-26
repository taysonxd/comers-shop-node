import { Request, Response, Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { countriesService } from "../services/countries.service";
import { formatSuccess } from "../utils/responseFormatter";

const router = Router()

router.get('/', asyncHandler(async (req: Request, res: Response) => {

    const countries = await countriesService.list();

    res.status(200).json(formatSuccess(countries));
}))

export default router