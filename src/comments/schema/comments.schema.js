const { Schema } = require("mongoose")

const commentScheam = new Schema({
    commentBody: {
        type: String,
        required: true
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "post", required: true }
}, {
    timestamps: true
})

module.exports = commentScheam