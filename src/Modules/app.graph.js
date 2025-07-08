import {GraphQLObjectType, GraphQLSchema, GraphQLString} from "graphql";
import * as postGraphController from "../Modules/Post/post.graph.controller.js";
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "query",
    description: "howhfoh",
    fields: {
      ...postGraphController.query,
    },
  }),
});
