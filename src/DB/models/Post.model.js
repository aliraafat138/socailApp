import mongoose, { model, Schema, Types } from "mongoose";
export const postSchema = new Schema({
    content: {
        type: String,
        minLength: 2,
        maxLength: 5000,
        trim: true,
        required: function() {
            return this.attachments && this.attachments.length > 0 ? false : true
        }
    },
    attachments: [{ secure_url: String, public_id: String }],
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    deletedBy: { type: Types.ObjectId, ref: "User" },
    tags: [{ type: Types.ObjectId, ref: "User" }],
    likes: [{ type: Types.ObjectId, ref: "User" }],
    isDeleted: Date,
    isArchived: Boolean
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

})
postSchema.virtual('comments', {
    localField: '_id',
    foreignField: 'postId',
    ref: 'Comment',
    // justOne: true
})

export const postModel = mongoose.models.Post || model('Post', postSchema)