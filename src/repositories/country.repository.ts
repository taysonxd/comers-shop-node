import { Country } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const countryRepository = {

    async findAll(): Promise<Country[]> {
        return await prisma.country.findMany();
    }
}