module.exports = {
    auth: require('./token'),
    complaintAccess: require("./complaintMiddleware"),
    userAccess: require("./userMiddleware")
};
