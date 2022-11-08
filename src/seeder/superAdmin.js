const {userModel} = require("../models");
const superAdminJson = require('./data/superAdmin.json')
const bcrypt = require("bcrypt");
const {allConstants} = require('../constant');
console.log(superAdminJson);

const superAdminSeed = async () => {
    try {
        let password = bcrypt.hashSync(superAdminJson.password, allConstants.ROUND);
        superAdminJson.password = password
        const superAdminType = await userModel.find({userType: 'superAdmin'});
        if (superAdminType.length) {
            console.log(`Super admin is already added`);
            return false;
        }
        await userModel.create(superAdminJson);
        console.log(`Super admin are created successfully`);
    } catch (error) {
        console.log(error);
    };
};

module.exports = {superAdminSeed}
