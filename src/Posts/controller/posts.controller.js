// child know parents  
const { User } = require("../../Users/model/users.model");
const { comment } = require("../../comments/model/comment.model");
const { Post } = require("../model/posts.model");

const { StatusCodes } = require("http-status-codes")

const GetPostHandller = async (req, res) => {
    try {
        // const data = await Post.find().populate("createdBy", "firstName lastName email");
        let postArr = [];
        const cursor = Post.find().populate("createdBy", "firstName lastName").cursor();// (pointer) contain location 
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            const comments = await comment.find({ postId: doc._id }).populate("createdBy", "firstName lastName");
            console.log(doc._doc);// all data in document              // console.log(doc._id)  -->  only id od document
            const obj = { ...doc._doc, comments }
            postArr.push(obj)
        }
        res.status(StatusCodes.OK).json({ message: "success", data: postArr })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: error.message })
    }
}

const CreatePostHandller = async (req, res) => {
    const { body, createdBy } = req.body;
    try {
        const Find = await User.findById({ _id: createdBy })

        if (Find) {
            const data = new Post({ body, createdBy })
            await data.save()
            res.status(StatusCodes.CREATED).json({ message: "Success", data })
        }
        else
            res.status(StatusCodes.NOT_FOUND).json({ message: "User Not Found ", Find })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: error.message })
    }
}

const PutPostHandller = async (req, res) => {
    const { id } = req.params;
    const { body } = req.body;
    try {
        const data = await Post.updateOne({ _id: id }, {
            body
        })
        if (data.matchedCount)
            res.status(StatusCodes.OK).json({ message: "Updated", data })
        else
            res.status(StatusCodes.NOT_FOUND).json({ message: "post not found", data })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: error.message })
    }
}

const DeletePostHandller = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Post.deleteOne({ _id: id })
        if (data.deletedCount)
            res.status(StatusCodes.OK).json({ message: "succcess", data })
        else
            res.status(StatusCodes.NOT_FOUND).json({ message: "Id not existed", data })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: error.message })
    }
}

module.exports = {
    GetPostHandller,
    PutPostHandller,
    CreatePostHandller,
    DeletePostHandller
}