const { allConstants } = require('../constant')

const verifyComplaintAccess = async ( req, res, next ) => {
    try {
        let access = false
        const user = req.userData
        if(user.userType == 'admin' || user.userType == 'superAdmin'){
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
    verifyComplaintAccess
}