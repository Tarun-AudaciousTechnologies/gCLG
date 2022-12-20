const { complaintsModel, userModel } = require("../models");
const { pagination } = require("../helper");
const mongoose = require("mongoose");
const tesseract = require("node-tesseract-ocr");
const path = require("path");
const fs = require("fs");
const handlebar = require("handlebars")
const {emailTemplate}  = require("../helper")
const { errorHandler } = require("../helper/responseHandler");
const { allStatus, allConstants } = require("../constant");
const Handlebars = require("handlebars");
const {emailHelper} = require("../helper");

const addComplaint = async (req, res) => {
  try {
    const { complaintType, description, area, city } = req.body;
    const { _id } = req.userData;
    const fileData = req.files;
    const panCard = fileData.panCard.map((item) => {
      return item.path;
    });
    const panCardFileName = fileData.panCard.map((item) => {
      return item.filename;
    });
    const images = fileData.images.map((item) => {
      return item.filename;
    });
    const config = {
      lang: "hin+eng",
      oem: 1,
      psm: 3,
    };
    for(let i=0;i<panCard.length;i++){
      var a
      await tesseract.recognize(panCard[i].toString(), config)
      .then((text) => {
        a+=text;
      })
      .catch((error) => {
        console.log(error);
      })
    }
    console.log(a)
    const data = a.toLowerCase().includes("indore" || "इन्दौर")
    if(data){
      await complaintsModel.create({
        requestedBy: _id,
        complaintType,
        panCard: panCardFileName.toString(),
        images,
        city,
        area,
        description,
      });
      return res.status(404).json({ message: "Complaint added successfully" });
    }
    else{
      fileData.panCard.map(async (ind) => {
        const url = path.resolve("uploads", ind.filename);
        fs.unlinkSync(url);
      });
      fileData.images.map(async (ind) => {
        const url = path.resolve("uploads", ind.filename);
        fs.unlinkSync(url);
      });
      return res
        .status(200)
        .json({
        message: "Sorry this site is only for the citizen of Indore",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getComplaint = async (req, res) => {
  try {
    const { _id } = req.userData;
    const data = await complaintsModel.find({ requestedBy: _id });
    return res.status(200).json({ message: "Data found", data });
  } catch (error) {
    console.log(error);
    return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.INTERNAL_SERVER_ERROR)
  }
};

const allComplaints = async (req, res) => {
  try {
    const { search = "", fromDate, toDate, field, sortBy } = req.query;
    const { offset, limits } = pagination.paginationData(req.query);
    let condition = {};
    if (search) {
      condition.$or = [
        {
          complaintType: {
            $regex: new RegExp(
              search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&", "i")
            ),
          },
        },
        {
          requestedBy: {
            $regex: new RegExp(
              search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&", "i")
            ),
          },
        },
      ];
    }
    if (fromDate && toDate) {
      condition.joiningDate = {
        $gte: new Date(moment.utc(fromDate).startOf("day").format()),
        $lte: new Date(moment.utc(toDate).endOf("day").format()),
      };
    }
    if (sortBy) {
      var sort = { [field]: parseInt(sortBy) };
    } else {
      var sort = { createdAt: -1 };
    }
    const data = await complaintsModel.aggregate([
      {
        $lookup: {
          from: "user",
          localField: "requestedBy",
          foreignField: "_id",
          as: "userDetail",
        },
      },
      { $match: condition },
      { $unset: "userDetail.password" },
      { $limit: limits },
      { $skip: offset },
      { $sort: sort },
    ]);
    return res.status(200).json({ message: "Data fetched successfully", data });
  } catch (error) {
    console.log(error);
    return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.INTERNAL_SERVER_ERROR)
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    await complaintsModel.findByIdAndDelete({ _id: id });
    return res.status(200).json({ message: "complaint deleted" });
  } catch (error) {
    console.log(error);
    return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.INTERNAL_SERVER_ERROR)
  }
};

const statusUpdate = async (req, res) => {
  try {
    const {id} = req.params;
    const { status, complaintDescription} = req.body
    let subject
    if(status == 'approved'){
      await complaintsModel.findByIdAndUpdate({_id: id},{
        $set: {
          status
        }
      })
    }else {
      var data = await complaintsModel.findByIdAndUpdate({_id: id},{
        $set: {
          status
        }
      })
      const userData = await userModel.findById({_id: data.requestedBy})
      const htmlRequest = await fs.readFileSync(
        `${__dirname}/../emailTemplates/rejectComplain.html`,
        'utf8',
      )
      const template = Handlebars.compile(htmlRequest)
      const replacements = {
        name: userData.name,
        complaintDescription: complaintDescription,
        email: userData.email,
      }
      const htmlToSend = template(replacements)
      const options = {
        from: process.env.USER_NAME,
        to: userData.email,
        subject: allConstants.EMAIL_REJECTION,
        html: htmlToSend,
        attachments: [
          {
            filename: 'logo.png',
            path: __dirname + `/../emailTemplates/logoblue.png`,
            cid: 'logo',
          },
        ],
      }
      await emailHelper.sendMail(options)
    }
    return res.status(200).json({message: "status update successfully", status: status});
  } catch (error) {
    console.log(error);
    return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.INTERNAL_SERVER_ERROR)
  }
};

module.exports = {
  addComplaint,
  deleteComplaint,
  allComplaints,
  getComplaint,
  statusUpdate
};
