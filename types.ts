import {OptionalId} from "mongodb"

export type RestaurantModel = OptionalId<{
    nombre: string,
    direccion: string,
    tlf: string,
    ciudad: string,
    pais: string,
    timezone: string,
    
}>;

