const { Schema } = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: [10, "under the age"]
    },
    address: String,
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true
    },
    repeat_password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        required: true
    }
}, {
    timestamps: true
});


userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 7);
    this.repeat_password = this.password;
    next()
})


module.exports = userSchema;