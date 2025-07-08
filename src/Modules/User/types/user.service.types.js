import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import {attachResponse} from "../../../utilis/app.shared.types.js";
export const oneUserType = {
  _id: {type: GraphQLID},
  userName: {type: GraphQLString},
  email: {type: GraphQLString},
  image: {type: attachResponse},
  gender: {
    type: new GraphQLEnumType({
      name: "GenderTypes",
      values: {
        male: {type: GraphQLString},
        female: {type: GraphQLString},
      },
    }),
  },
  role: {
    type: new GraphQLEnumType({
      name: "RoleTypes",
      values: {
        user: {type: GraphQLString},
        Admin: {type: GraphQLString},
        superAdmin: {type: GraphQLString},
      },
    }),
  },
};
export const userResponse = new GraphQLObjectType({
  name: "UserResponse",
  fields: {
    ...oneUserType,
    viewers: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "viewersType",
          fields: {
            ...oneUserType,
          },
        })
      ),
    },
    updatedBy: {type: GraphQLID},
  },
});
