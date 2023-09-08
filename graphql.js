const bcrypt = require("bcryptjs");
const { gql } = require("apollo-server-express");
const passport = require("passport");

// Define your GraphQL Schema
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Query {
    currentUser: User
  }

  type Mutation {
    signup(username: String!, password: String!): User
  }

  type Mutation {
    createUser(username: String!, password: String!): User
    login(username: String!, password: String!): User
  }
`;
const users = [];
// Define your resolvers
const resolvers = {
  Query: {
    currentUser: (parent, args, { user }) => user,
  },
  Mutation: {
    signup: async (parent, { username, password }, { req }) => {
      try {
        // Check if the user with the same username already exists
        const existingUser = users.find((user) => user.username === username);
        if (existingUser) {
          throw new Error("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
          id: users.length + 1,
          username,
          password: hashedPassword,
        };

        users.push(newUser);

        req.logIn(newUser, (err) => {
          if (err) {
            throw err; // Handle the error appropriately
          }
        });

        return newUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    //  login resolver code here
    login: async (parent, { username, password }, { req }) => {
      return new Promise((resolve, reject) => {
        passport.authenticate("local", (err, user) => {
          if (err) reject(err);
          if (!user) reject(new Error("Invalid credentials"));
          req.logIn(user, () => {
            resolve(user);
          });
        })(req);
      });
    },
  },
};

module.exports = { typeDefs, resolvers };
