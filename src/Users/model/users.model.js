const mongoose = require("mongoose");
const userSchema = require("../schema/users.schema");

exports.User = mongoose.model("user", userSchema)