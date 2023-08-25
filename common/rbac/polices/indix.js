const { Admin, User } = require("../../enum/roles");
const adminPolice = require("./adminPolice");
const userPolice = require("./userPolice");

exports.opt = {
    [Admin]: adminPolice,
    [User]: userPolice
}