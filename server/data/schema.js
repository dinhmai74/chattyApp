import { gql, } from "apollo-server"

export const typeDefs = gql`
  # declare custom scalars
  scalar Date

  # a group chat entity
  type Group {
    id: Int! # unique id for the group
    name: String
    users: [User]! # users in the group
    messages: [Message] #messages sent to the group
  }

  # a user -- keep type really simple for now
  type User {
    id: Int!
    email: String!
    username: String
    messages: [Message] # messages sent by user
    groups: [Group] # groups the user belong to
    friends: [User] # user's friends/contacts
  }

  # a message sent from a user to a group
  type Message {
    id: Int!
    to: Group! # group message was sent in
    from: User!
    text: String # message text
    createdAt: Date!
  }

  # query for types
  type Query {
    # Return a user by their email or id
    user(email: String, id: Int): User
    # Return messages sent by a user via userId
    # Return messages sent to a group via groupId
    messages(groupId: Int, userId: Int): [Message]
    # Return a group by its id
    group(id: Int!): Group
  }
  schema {
    query: Query
  }
`
export default typeDefs
