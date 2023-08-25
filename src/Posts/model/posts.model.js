const mongoose = require("mongoose");
const postSchema = require("../schema/posts.schema");

exports.Post = mongoose.model("post", postSchema);