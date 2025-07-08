import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import {attachResponse} from "../../../utilis/app.shared.types.js";
import {userResponse} from "../../User/types/user.service.types.js";

export const onePostResponse = new GraphQLObjectType({
  name: "onePostResponse",
  fields: {
    _id: {type: GraphQLID},
    content: {type: GraphQLString},
    attachments: {type: new GraphQLList(attachResponse)},
    createdBy: {type: userResponse},
    updatedBy: {type: GraphQLID},
    deletedBy: {type: GraphQLID},
    tags: {type: new GraphQLList(GraphQLID)},
    likes: {type: new GraphQLList(GraphQLID)},
    image: {type: attachResponse},
    isDeleted: {type: GraphQLString},
  
  },
});

export const postListResponse = new GraphQLObjectType({
  name: "postListResponse",
  fields: {
    message: {type: GraphQLString},
    statusCode: {type: GraphQLInt},
    data: {type: new GraphQLList(onePostResponse)},
  },
});
