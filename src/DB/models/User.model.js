import mongoose, {model, Schema, Types} from "mongoose";
export const genderTypes = {male: "male", female: "female"};
export const roleTypes = {
  user: "User",
  Admin: "Admin",
  superAdmin: "superAdmin",
};
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    email: {type: String, required: true, unique: true},
    confirmEmailOTP: String,
    tempEmail: String,
    tempEmailOTP: String,
    password: {type: String, required: true},
    resetPasswordOTP: String,
    image: {secure_url: String, public_id: String},
    DOB: Date,
    address: String,
    phone: String,
    coverImages: [{secure_url: String, public_id: String}],
    gender: {
      type: String,
      enum: Object.values(genderTypes),
      default: genderTypes.male,
    },
    role: {
      type: String,
      enum: Object.values(roleTypes),
      default: roleTypes.user,
    },
    confirmEmail: {type: Boolean, default: false},
    isDeleted: Date,
    changeTimeCredential: Date,
    viewers: [
      {
        userId: {type: Types.ObjectId, ref: "User"},
        time: Date,
      },
    ],
    updatedBy: {type: Types.ObjectId, ref: "User"},
    friends: [{type: Types.ObjectId, ref: "User"}],
  },
  {timestamps: true}
);

export const userModel = mongoose.models.User || model("User", userSchema);
export const socketConnections = new Map();
