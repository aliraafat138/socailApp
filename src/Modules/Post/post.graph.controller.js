import {GraphQLList, GraphQLString} from "graphql";
import * as postQueryService from "./service/post.query.service.js";
import * as postTypes from "./types/post.service.types.js";
export const query = {
  postList: {
    type: postTypes.postListResponse,
    resolve: postQueryService.posList,
  },
};
