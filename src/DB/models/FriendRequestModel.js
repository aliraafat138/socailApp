import mongoose, {model, Schema, Types} from "mongoose";

export const friendRequestSchema = new Schema(
  {
    friendId: {type: Types.ObjectId, ref: "User", required: true},
    createdBy: {type: Types.ObjectId, ref: "User", required: true},
    status: {type: Boolean, default: false},
  },
  {timestamps: true}
);

export const friendRequestModel =
  mongoose.models.friendRequestModel ||
  model("friendRequestModel", friendRequestSchema);
