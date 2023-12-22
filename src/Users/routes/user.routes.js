const { getUerHandler, postUserHandler, putUserHandler, delteUserHandler, signInHandler, VerifiedHandler } = require("../controller/users.controller");

const routes = require("express").Router();

const validate = require("../../../common/middleware/validate");
const Auth = require("../../../common/middleware/auth");
const { addUsersSchema, updateUsersSchema, signInSchema } = require("../joi/userValidation");
const { GetAllUsers, DeletUser } = require("../endPoints");
// , Auth(GetAllUsers)
routes.get("/user", getUerHandler)
routes.get("/user/verified/:token", VerifiedHandler)


routes.post("/user", validate(addUsersSchema), postUserHandler)
routes.post("/auth", validate(signInSchema), signInHandler)

routes.put("/user/:id", validate(updateUsersSchema), putUserHandler)

routes.delete("/user/:id", Auth(DeletUser), delteUserHandler)

module.exports = routes