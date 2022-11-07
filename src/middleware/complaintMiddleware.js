const { allConstants } = require('../constant')
const {complaintsModel,userModel} = require("../models")

const verifyComplaintAccess = async ( req, res, next ) => {
    try {
        let access = false
        const {id} = req.params
        const {userType} = req.userData
        const data = await complaintsModel.findById({_id:id})
        const user = await userModel.findById({_id: data.requestedBy})
        if(user.userType == 'admin'){
            if(userType == 'admin'){
                return res.status(400).json({message: allConstants.NOT_ACCESS})
            }
        }
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
    verifyComplaintAccess
}