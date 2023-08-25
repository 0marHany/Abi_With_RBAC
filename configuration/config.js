const mongoose = require("mongoose")

module.exports = () => {
    mongoose.connect(process.env.Mongoo_Connection)
        .then((resulte) => {
            console.log("db connted");
        })
        .catch((error) => {
            console.log(error);
        })
}