const {superAdminSeed} = require('./superAdmin')

const defaultDb = async () => {
    superAdminSeed();
}

module.exports = {defaultDb};