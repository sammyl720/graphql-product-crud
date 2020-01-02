const { ApolloServer, gql } = require("apollo-server");
const ProductDb = require("./db");
const uuid = require("uuid/v4");
// Construct a schema, using GraphQL schema language
const products = new ProductDb();

const typeDefs = gql`
  type Query {
    hello: String
    products: [Product!]!
    getProduct(id: ID!): Product!
  }
  type Mutation {
    addProduct(data: ProductInput!): Product!
    editProduct(id: ID!, data: EditProductInput): Product!
    deleteProduct(id: ID!): Product!
  }
  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
  }
  input ProductInput {
    name: String!
    price: Float!
    description: String
  }
  input EditProductInput {
    name: String
    price: Float
    description: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => "Hello world!",
    products: (root, args, context) => products.getAllProducts(),
    getProduct: (root, args, context) => {
      const product = products.getProductById(args.id);
      if (!product) throw new Error("Could not find product with that id");
      return product;
    }
  },
  Mutation: {
    addProduct: (root, { data }, context) => {
      let product = {};
      product.id = uuid();
      product = {
        ...product,
        ...data
      };

      products.addProduct(product);
      // products.syncProducts();
      return product;
    },
    editProduct: (root, { id, data }, context) => {
      let product = products.getProductById(id);
      if (!product) throw new Error("Could not find product with that id");
      for (let [key, value] of Object.entries(data)) {
        product[key] = value;
      }
      return products.editProduct(product);
    },
    deleteProduct: (root, { id }, context) => {
      let product = products.getProductById(id);
      if (!product) throw new Error("Could not find product with that id");

      return products.deleteProduct(product.id);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
