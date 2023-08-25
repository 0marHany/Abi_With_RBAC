const joi = require("joi");

module.exports = {
    AddPostSchema: {
        body: joi.object().required().keys({
            body: joi.string().required(),
            createdBy: joi.string()
        }),
    },
    UpdatePostSchema: {
        body: joi.object().required().keys({
            body: joi.string().required(),
        }),
    }
}