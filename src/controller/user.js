const {userModel} = require("../models");
const bcrypt = require("bcrypt");
const { errorHandler } = require("../helper/responseHandler");
const { allStatus, allConstants } = require("../constant");
const {pagination} = require("../helper")
const fs = require("fs")
const Handlebars = require("handlebars");
const {emailHelper} = require("../helper")

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
        } = req.body 
        console.log(name,age,phone);
        const data = await userModel.findOne({email});
        if(city!='Indore'){
            return res.status(404).json({message: "Sorry this site is only for Indori's"});
        }
        let salt = await bcrypt.genSaltSync(10)
        const hashPassword = await bcrypt.hash(password, salt)
        await userModel.create([{
            name,
            age,
            email,
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

const addAdmin = async (req, res) => {
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
    const {_id} = req.userData;
    const user = await userModel.findOne({email});
    if(user){
      return res.status(400).json({message: "email already present"});
    }
    const data = await userModel.findById({_id:_id});
    if(data.userType=='superAdmin'){
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
      const htmlRequest = await fs.readFileSync(
        `${__dirname}/../emailTemplate/addUser.html`,
        'utf8',
      )
      const template = Handlebars.compile(htmlRequest)
      const replacements = {
        name,
        password: password,
        email,
      }
      const htmlToSend = template(replacements)
      const options = {
        from: process.env.USER_NAME,
        to: email,
        subject: allConstants.EMAIL_SUBJECT,
        html: htmlToSend,
        attachments: [
          {
            filename: 'logo.png',
            path: __dirname + `/../emailTemplate/logoblue.png`,
            cid: 'logo',
          },
        ],
      }
      await emailHelper.sendMail(options)
      return res.status(201).json({message: "Admin Added Successfully"});
    }
    return res.status(400).json({message: "Only superamdin can add admin"})
  } catch (error) {
    console.log(error)
    return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.INTERNAL_SERVER_ERROR);
  }
}

const deleteUserByAdmin = async (req, res) => {
    try {
        const {_id} = req.userData
        console.log(req.userData);
        const {id} = req.params;
        const data = await userModel.findById({_id:id})
        if(_id==id || data.userType=='admin'){
          return res.status(400).json({message:"Sorry you can not delete your ID and any admin ID"})
        }
        await userModel.deleteOne({_id:id});
        return res.status(200).json({message: "Account deleted successfully"});
    } catch (error) {
        console.log(error);
        return errorHandler(res, allStatus.NOT_FOUND, allConstants.INTERNAL_SERVER_ERROR, error)      
    }
}

const deleteById = async (req, res) => {
  try {
    const {_id} = req.userData
    await userModel.findOneAndDelete({_id:_id});
    return res.status(200).json({message: "Account deleted successfully"});
  } catch (error) {
    console.log(error);
    return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.INTERNAL_SERVER_ERROR);
  }
}

const userDetail = async (req, res) => {
    try {
        const { search = '', fromDate, toDate, field, sortBy } = req.query
        const {offset, limits} = pagination.paginationData(req.query)
        let condition = {
          userType: {
            $ne: 'superAdmin',
          },
        }
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
            },
            {
              userType: {
                $regex: new RegExp(
                  search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&', 'i'),
                ),
              },
            }
          ]
        }
        if(sortBy){
            var sort = {[field]: parseInt(sortBy)}
        }else {
            var sort = {createdAt: -1}
        }
        const data = await userModel.aggregate([
          { $match: condition },
          { $unset: 'password' },
          { $sort: sort},
          { $limit : limits },
          { $skip : offset },
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
    deleteById,
    userDetail,
    getUserById,
    addAdmin
}