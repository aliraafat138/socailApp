import {GraphQLObjectType, GraphQLString} from "graphql";

export const attachResponse = new GraphQLObjectType({
  name: "attachResponse",
  fields: {
    secure_url: {type: GraphQLString},
    public_id: {type: GraphQLString},
  },
});
