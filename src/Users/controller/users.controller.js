const { User } = require("../model/users.model")
const { StatusCodes } = require("http-status-codes")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../../services/Sendmail");

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
            const info = await sendEmail(
                process.env.SENDER,
                [email],
                "EMAIL VERFICIATION",
                "confirmation",
                `    <!DOCTYPE html>
                            <html lang="en">
                            <head>
                              <meta charset="UTF-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                              <title>Email Confirmation</title>
                              <style>
                                body {
                                  font-family: Arial, sans-serif;
                                  margin: 0;
                                  padding: 0;
                                  background-color: #f4f4f4;
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                  height: 100vh;
                                }
                            
                                .container {
                                  max-width: 600px;
                                  padding: 20px;
                                  background-color: #ffffff;
                                  border-radius: 5px;
                                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                  text-align: center;
                                }
                            
                                h1 {
                                  color: #333333;
                                }
                            
                                p {
                                  color: #555555;
                                }
                            
                                .button {
                                  display: inline-block;
                                  padding: 10px 20px;
                                  font-size: 16px;
                                  text-decoration: none;
                                  color: #ffffff;
                                  background-color: #007bff;
                                  border-radius: 5px;
                                  cursor: pointer;
                                }
                            
                                .button:hover {
                                  background-color: #0056b3;
                                }
                            
                                .confirmation-message {
                                  display: none;
                                  margin-top: 20px;
                                  color: #28a745;
                                  font-weight: bold;
                                }
                            
                                a {
                                  color: #ffffff;
                                  text-decoration: none;
                                }
                              </style>
                            </head>
                            <body>
                              <div class="container">
                                <h1>Email Confirmation</h1>
                                <p>Thank you for signing up! Please confirm your email address by clicking the button below:</p>
                                <a href="http://localhost:${process.env.port}/user/verified/${token}"><button class="button">Yes, I'm Confirming</button></a>
                              </div>
                            </body>
                            </html>
                `
            );
            console.log(info);
            res.status(StatusCodes.CREATED).json({ message: "succcess", data })
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: error.message })
    }
}
exports.VerifiedHandler = async (req, res) => {
    const { token } = req.params;
    const decode = jwt.verify(token, process.env.sekretkey)
    const user = await User.findOne({ _id: decode._id })
    if (user) {
        await User.updateOne({ _id: user._id }, {
            verified: true
        })
        res.status(StatusCodes.OK).json({ verified: true })
    }
    else
        res.status(StatusCodes.FORBIDDEN).json({ verified: false })
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
