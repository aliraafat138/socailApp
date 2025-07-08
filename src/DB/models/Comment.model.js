import mongoose, { model, Schema, Types } from "mongoose";
export const commentSchema = new Schema({
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
    postId: { type: Types.ObjectId, ref: "Post", required: true },
    commentId: { type: Types.ObjectId, ref: "Comment", },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    deletedBy: { type: Types.ObjectId, ref: "User" },
    tags: [{ type: Types.ObjectId, ref: "User" }],
    likes: [{ type: Types.ObjectId, ref: "User" }],
    isDeleted: Date
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
commentSchema.virtual('reply', {
    localField: '_id',
    foreignField: 'commentId',
    ref: 'Comment'
})
export const commentModel = mongoose.models.Comment || model('Comment', commentSchema)