const {userModel} = require("../models");
const bcrypt = require("bcrypt");
const { errorHandler } = require("../helper/responseHandler");
const { allStatus, allConstants } = require("../constant");
const {pagination} = require("../helper")

const addUser = async (req, res) => {
    try {
        const {
            name,
            age,
            email,
            password,
            phone,
            street_address,
            city,
            userType
        } = req.body 
        const data = await userModel.findOne({email});
        if(data){
            return res.status(404).json({message: "email already present"});
        }
        if(city!='Indore'){
            return res.status(404).json({message: "Sorry this site is only for Indori's"});
        }
        let salt = await bcrypt.genSaltSync(10)
        const hashPassword = await bcrypt.hash(password, salt)
        await userModel.create([{
            name,
            age,
            email,
            userType,
            password: hashPassword,
            phone,
            street_address,
            city
        },])
        return res.status(201).json({message: "User Added Successfully"});
    } catch (error) {
        console.log(error);
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.INTERNAL_SERVER_ERROR)
    }
}

const deleteUserByAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await userModel.findById({_id:id});
        await userModel.deleteOne({_id:id});
        return res.status(200).json({message: "Account deleted successfully"});
    } catch (error) {
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.INTERNAL_SERVER_ERROR)      
    }
}

const deleteUser = async (req, res) => {
    try {
        const {_id} = req.userData;
        const data = await userModel.findByIdAndDelete({_id:id});
        return res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.INTERNAL_SERVER_ERROR)
    }
}

const userDetail = async (req, res) => {
    try {
        const { search = '', fromDate, toDate, field, sortBy } = req.query
        const {offset, limits} = pagination.paginationData(req.query)
        let condition = {}
        if (search) {
          condition.$or = [
            {
              name: {
                $regex: new RegExp(
                  search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&', 'i'),
                ),
              },
            },
            {
              email: {
                $regex: new RegExp(
                  search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&', 'i'),
                ),
              },
            }
          ]
        }
        if (fromDate && toDate) {
          condition.joiningDate = {
            $gte: new Date(moment.utc(fromDate).startOf('day').format()),
            $lte: new Date(moment.utc(toDate).endOf('day').format()),
          }
        }
        if(sortBy){
            var sort = {[field]: parseInt(sortBy)}
        }else {
            var sort = {createdAt: -1}
        }
        const data = await userModel.aggregate([
          { $match: condition },
          { $unset: 'password' },
          { $limit : limits },
          { $skip : offset },
          { $sort: sort},
        ])
        return res.status(200).json({message: "Data fetched successfully", data});
    } catch (error) {
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.INTERNAL_SERVER_ERROR);
    }
}

const getUserById = async (req, res) => {
    try {
        const {_id} = req.userData
        const data = await userModel.findOne({_id: _id});
        return res.status(200).json({message: "Data found successfully", data});
    } catch (error) {
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    addUser,
    deleteUserByAdmin,
    deleteUser,
    userDetail,
    getUserById
}