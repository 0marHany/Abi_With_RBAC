const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { User } = require("../../src/Users/model/users.model");
const rbac = require("../rbac/rbac");

module.exports = (endPoit) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token, process.env.Secret_key);
            console.log(decode);
            const user = await User.findOne({ _id: decode._id });
            // console.log(user.role);
            if (!user) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
            } else {
                // req.role = user.role;
                const isAllowed = await rbac.can(user.role, endPoit)
                console.log(isAllowed);
                if (isAllowed) {
                    next();
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "**************UNAUTHORIZED" });
                }
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    };
};
