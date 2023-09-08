const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
const { typeDefs, resolvers } = require("./graphql"); // Import your GraphQL schema and resolvers

const app = express();
const session_key = process.env.SESSION_KEY;

app.use(
  session({
    secret: session_key,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport for incoming requests, allowing authentication strategies to be applied.
app.use(passport.initialize());
// Middleware that will restore login state from a session.
app.use(passport.session());

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ user: req.user }),
});

async function startApoloServer() {
  await server.start();
  server.applyMiddleware({ app });
}
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something went wrong!");
});

startApoloServer().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `Server is running on http://localhost:${PORT}${server.graphqlPath}`
    );
  });
});
