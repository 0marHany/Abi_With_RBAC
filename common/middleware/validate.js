const { StatusCodes } = require("http-status-codes");

module.exports = (schema) => {
    return (req, res, next) => {
        const validationResults = schema.body.validate(req.body)
        if (validationResults.error)
            res.status(StatusCodes.BAD_REQUEST).json({ Error: validationResults.error.details[0].message })
        else
            next();
    }
}