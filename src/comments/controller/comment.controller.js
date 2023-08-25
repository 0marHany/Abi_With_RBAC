

const { StatusCodes } = require("http-status-codes")
const { comment } = require("../model/comment.model");
const { Post } = require("../../Posts/model/posts.model");
exports.getAllcommentHandler = async (req, res) => {
    try {
        const data = await comment.find().populate("createdBy", "firstName lastName").populate("postId");
        res.status(StatusCodes.OK).json({ message: "success", data })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ Error: error.message })
    }
}


exports.postAllcommentHandler = async (req, res) => {
    const { commentBody, createdBy, postId } = req.body
    try {
        const post = await Post.findOne({ _id: postId });
        if (post) {
            const newComment = new comment({ commentBody, createdBy, postId })
            await newComment.save()
            // await Post.updateOne({ _id: postId }, { commentIds: [...post.commentIds, newComment._id] })
            res.status(StatusCodes.CREATED).json({ message: "success", data: newComment })
        }
        else
            res.status(StatusCodes.NOT_FOUND).json({ message: "post not found", post })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ Error: error.message })
    }
}

exports.putcommentHandler = async (req, res) => {
    const { id } = req.params;
    const { commentBody } = req.body;

    try {
        // Update the comment
        const updatedComment = await comment.updateOne({ _id: id }, { commentBody });
        if (updatedComment.matchedCount)
            // const post = await Post.findOne({ _id: postId });    
            // await post.updateOne({ _id: postId }, { commentIds: [...post.commentIds.map((c) => c._id == id ? updatedComment : c)] });
            res.status(StatusCodes.OK).json({ message: "success", data: updatedComment });
        else
            res.status(StatusCodes.NOT_FOUND).json({ message: "comment not Found", data: updatedComment });

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred" });
    }
};


exports.delecommentHandler = async (req, res) => {
    const { id } = req.params;
    // const { postId } = req.body;
    try {
        const data = await comment.deleteOne({ _id: id })
        if (data.deletedCount)
            // const post = await Post.findOne({ _id: postId });
            // await Post.updateOne({ _id: postId }, { commentIds: [...post.commentIds.filter((c) => c._id != id)] })
            res.status(StatusCodes.OK).json({ message: "success", data })
        else
            res.status(StatusCodes.NOT_FOUND).json({ message: "comment not Found", data })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ Error: error.message })
    }
}



