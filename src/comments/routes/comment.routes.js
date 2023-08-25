const { getAllcommentHandler, postAllcommentHandler, putcommentHandler, delecommentHandler } = require("../controller/comment.controller");

const routes = require("express").Router();

routes.get("/comment", getAllcommentHandler);
routes.post("/comment", postAllcommentHandler);
routes.put("/comment/:id", putcommentHandler);
routes.delete("/comment/:id", delecommentHandler);

module.exports = routes;
