const { Schema } = require("mongoose");
const postSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true

    },
    // commentIds: [{ type: Schema.Types.ObjectId, ref: "comment" }]
})

module.exports = postSchema; 