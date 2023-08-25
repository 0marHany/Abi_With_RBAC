const Joi = require("joi");

module.exports = {
    addUsersSchema: {
        body: Joi.object().required().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            age: Joi.number().min(10).required(),
            gender: Joi.valid('male', 'female').required(),
            email: Joi.string().email().required(),
            address: Joi.string(),
            password: Joi.string().required(),
            repeat_password: Joi.ref('password'),
            role: Joi.valid("user", "admin").required()
        })
    },
    signInSchema: {
        body: Joi.object().required().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
    },
    updateUsersSchema: {
        body: Joi.object().required().keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            age: Joi.number().min(10),
            address: Joi.string()
        })
    }
}