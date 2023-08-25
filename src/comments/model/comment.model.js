const mongoose = require("mongoose");
const commentScheam = require("../schema/comments.schema");

exports.comment = mongoose.model("comment", commentScheam)