const express = require('express')
require('dotenv').config()

const app = express()
const dbconnected = require("./configuration/config")
const userRoutes = require("./src/Users/routes/user.routes")
const postRoutes = require("./src/Posts/routes/posts.routes")
const commentRoutes = require("./src/comments/routes/comment.routes")

dbconnected()

app.use(express.json());

app.use(userRoutes);
app.use(postRoutes);
app.use(commentRoutes);

const port = process.env.port || 5000


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))