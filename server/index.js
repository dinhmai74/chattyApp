import { ApolloServer, gql } from "apollo-server"

const PORT = 8080

const typeDefs = gql`
  type Query {
    testString: String,
    newString: String
  },
`

const server = new ApolloServer({ typeDefs, mocks: true })

server
  .listen({ port: PORT })
  .then(({ url }) => console.log(`🚀 Server ready at ${url}`))
