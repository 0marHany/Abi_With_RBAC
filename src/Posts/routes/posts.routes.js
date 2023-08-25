const { GetPostHandller, CreatePostHandller, PutPostHandller, DeletePostHandller } = require("../controller/posts.controller");

const routes = require("express").Router();
const Validate = require("../../../common/middleware/validate");
const { AddPostSchema, UpdatePostSchema } = require("../joi/posts.validation");

routes.get('/post', GetPostHandller)

routes.post('/post', Validate(AddPostSchema), CreatePostHandller)

routes.put('/post/:id', Validate(UpdatePostSchema), PutPostHandller)

routes.delete('/post/:id', DeletePostHandller)

module.exports = routes