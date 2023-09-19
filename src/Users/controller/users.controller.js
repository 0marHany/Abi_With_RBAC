const { User } = require("../model/users.model")
const { StatusCodes } = require("http-status-codes")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getUerHandler = async (req, res) => {
    let { page, limit, searchKey } = req.query;
    try {
        if (page || limit) {
            if (!limit) {
                limit = 3
            }
            if (!page) {
                page = 1
            }
            const skip = parseInt((page - 1) * limit);
            const data = await User.find({}).limit(limit).skip(skip);
            res.status(StatusCodes.OK).json({ message: "succcess", data })
        } else if (searchKey) {
            const data = await User.find({ firstName: { $regex: searchKey } });
            res.status(StatusCodes.OK).json({ message: "succcess", data })
        } else {
            const data = await User.find();
            res.status(StatusCodes.OK).json({ message: "succcess", data })
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: error.message })
    }
}

exports.postUserHandler = async (req, res) => {
    const {
        firstName, lastName,
        age,
        address,
        gender,
        email,
        password, repeat_password, role } = req.body;
    try {
        const Find = await User.findOne({ email });
        // bcrypt.hash(password, 8, async (err, hash) => {
        //     if (err) throw new Error(err)
        // })
        if (Find)
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Email is already exist" })
        else {
            const data = new User({
                firstName, lastName,
                age,
                address,
                gender,
                email,
                password,
                repeat_password, role
            });
            await data.save()
            res.status(StatusCodes.CREATED).json({ message: "succcess", data })
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: error.message })
    }
}

exports.signInHandler = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // to get all data without password && repeat_password by use .select("-")
                // const data = await User.findOne({ email }).select("-password").select("-repeat_password");
                // Destructuring        //from data
                const { password, repeat_password, ...data } = user._doc;//do same but without need to get data from db agin
                let token = jwt.sign({ _id: data._id }, process.env.Secret_key, { expiresIn: '1d' })
                res.status(StatusCodes.ACCEPTED).json({ message: "success login", token, data })
            }
            else
                res.status(StatusCodes.BAD_REQUEST).json({ message: "invalid password" })
        }
        else
            res.status(StatusCodes.BAD_REQUEST).json({ message: "invalid email" })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: error.message })
    }
}

exports.putUserHandler = async (req, res) => {
    const { id } = req.params
    const {
        firstName, lastName,
        age,
        address } = req.body;
    try {
        const data = await User.updateOne({ _id: id }, {
            firstName, lastName,
            age,
            address
        });
        if (data.matchedCount)
            res.status(StatusCodes.OK).json({ message: "Updated", data })
        else
            res.status(StatusCodes.NOT_FOUND).json({ message: "User not found", data })

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ Error: error.message })
    }
}

exports.delteUserHandler = async (req, res) => {
    const { id } = req.params
    try {
        const data = await User.deleteOne({ _id: id });
        if (data.deletedCount)
            res.status(StatusCodes.OK).json({ message: "succcess", data })
        else
            res.status(StatusCodes.NOT_FOUND).json({ message: "Id not existed", data })

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ Error: error.message })
    }
}