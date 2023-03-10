const { allConstants } = require('../constant')

const verifyUserAccess = async ( req, res, next ) => {
    try {
        let access = false
        const {userType} = req.userData
        if(userType == 'admin' || userType == 'superAdmin'){
            access = true
            next()
        }
        else{
            return res.status(401).json({message: allConstants.NOT_ACCESS})
        }
    } catch (error) {
        return res.status(404).json({message: "Bad request"})
    }
}


module.exports = {
    verifyUserAccess
}