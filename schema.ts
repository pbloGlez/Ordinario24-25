export const schema = `#graphql
type Restaurant{
    id : ID!
    nombre: String!
    direccion: String!
    tlf: String!
    temperatura: String
    time: String!
}


type Query {
    getRestaurants(ciudad: String!) : [Restaurant!]!
    getRestaurant(id: ID!): Restaurant!
}

type Mutation{
    addRestaurant(nombre:String!, direccion: String!, ciudad: String!, tlf: String!): Restaurant!
    deleteRestaurant(id:ID!): boolean
}
`