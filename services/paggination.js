const pagginationServices = function (page, size) {
    console.log(page, size);
    if (!size) {
        size = 3;
    }
    if (!page) {
        page = 1;
    }
    const limit = parseInt(size);
    const skip = (page - 1) * limit
    return { limit, skip }
}

module.exports = pagginationServices;