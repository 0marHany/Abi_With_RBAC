var cron = require('node-cron');
const { User } = require('../../../src/Users/model/users.model');

const DaliyJobs = function () {
    cron.schedule('* * */23 * * *', async (req, res) => {
        const currentDate = new Date().toISOString();
        const data = await User.find({ "createdAt": currentDate });
        console.log({ New_User_Added_Today: data.length });
    });
}

module.exports = DaliyJobs