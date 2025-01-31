import { Collection, ObjectId } from "mongodb";
import { RestaurantModel } from "./types.ts";
import { GraphQLError } from "npm:graphql@^16.10.0";


type Context = {
    RestaurantCollection: Collection<RestaurantModel>
}

type GetRestaurantQueryArgs = {
    id : string
}

type GetRestaurantsQueryArgs = {
    ciudad : string
}

type AddRestaurantMutationArgs = {
    nombre: string,
    direccion: string,
    ciudad: string,
    tlf: string
}

type DeleteRestaurantMutationArgs = {
    id: string
}

export const resolvers = {
    Query: {
        getRestaurants: async(_: unknown, args: GetRestaurantsQueryArgs, c: Context): Promise<RestaurantModel[]> => {
            return await c.RestaurantCollection.find({ciudad: args.ciudad}).toArray()},

        getRestaurant: async(_:unknown, args: GetRestaurantQueryArgs, c: Context): Promise<RestaurantModel> => {
            const restaurante = await c.RestaurantCollection.findOne({_id: new ObjectId(args.id)})
            if(!restaurante) throw new GraphQLError("No se ha encontrado el restaurante");
            return restaurante;
        }
    },
    Mutations: {
        deleteRestaurant: async(_: unknown, args: DeleteRestaurantMutationArgs, c: Context): Promise<boolean> =>{
            const {deletedCount} = await c.RestaurantCollection.deleteOne({_id: new ObjectId(args.id)});
            return deletedCount == 1;
        }
    },
    Restaurant: {
        id:(parent: RestaurantModel): string => parent._id!.toString(),
        direccion: (parent: RestaurantModel): string => `${parent.direccion}, ${parent.ciudad}, ${parent.pais}`,
        hora: async (parent:RestaurantModel):Promise<string> => {
            const API_KEY = Deno.env.get("API_KEY") 
            if(!API_KEY) throw new GraphQLError("La API KEY de ninja no se ha encontrado");

            const urlTime =  `https://api.api-ninjas.com/v1/timezone?timezone=${parent.timezone}`;
            const getTime = await fetch(urlTime,
                {
                    header:{
                        "X-Api-Key" : API_KEY
                    }
                })

                if(getTime.status!==200) throw new GraphQLError("API NINJA ERROR");
            const datatime = await getTime.json();
            const timepo = `${datatime.hour} : ${datatime.minute}`
            return timepo;
        },
        temperatura : async(parent:RestaurantModel): Promise<string> => {
            const API_KEY = Deno.env.get("API_KEY")
            if(!API_KEY) throw new GraphQLError("API NINJA ERROR");

            const url = `https://api.api-ninjas.com/v1/weather?lat=${parent.ciudad}`
            const getT = await fetch(url, 
                {
                    header: {
                        "X-Api-Key" : API_KEY
                    }
                })
                if(getT.status !== 200) throw new GraphQLError("API NINJA ERROR");
                const data = await getT.json()
                return data.temperatura
        }

    }
}