import { Country } from "../interfaces/country.interface";
import { countryRepository } from "../repositories/country.repository";

export const countriesService = {

    async list(): Promise<Country[]> {
        return await countryRepository.findAll();
    },
        
}