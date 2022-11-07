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

const addComplaint = async (req, res) => {
  try {
    const { complaintType, description } = req.body;
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
    const data = a.includes("Welcome")
    if(data){
      await complaintsModel.create({
        requestedBy: _id,
        complaintType,
        panCard: panCardFileName.toString(),
        images,
        description,
      });
      return res.status(404).json({ message: "Complaint added successfully" });
    }
    else{
      const panImage = [fileData.panCard].flat();
      panImage.map(async (ind) => {
        const url = path.resolve("uploads", ind.filename);
        fs.unlinkSync(url);
      });
      const complaintImage = [fileData.images].flat();
      complaintImage.map(async (ind) => {
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
    console.log(status,complaintDescription);
    if(status == 'approved'){
      var subject = allConstants.COMPLAINT_ACCEPTED
      var data = await complaintsModel.findByIdAndUpdate({_id: id},{
        $set: {
          status
        }
      },{
        upsert: true,
        new: true
      })
    }
    else{
      var subject = allConstants.COMPLAINT_ACCEPTED
      var data = await complaintsModel.findByIdAndUpdate({_id: _id},{
        $set: {
          status
        }
      },{
        upsert: true,
        new: true
      })
    }
    const userDetail = await userModel.findById({_id: data.requestedBy});
    const htmlRequest = await fs.readFileSync(
      `${__dirname}/../emailTemplates/complaint.html`,
      'utf8',
    )
    const template = handlebar.compile(htmlRequest);
    const replacement = {
      name: userDetail.name,
      complaintDescription: complaintDescription,
      email: userDetail.email
    }
    const htmlToSend = template(replacement)
    const options = {
      from: process.env.USER_NAME,
      to: userDetail.email,
      subject: subject,
      html: htmlToSend,
      attachments: [
        {
          filename: 'logo.png',
          path: __dirname + `/../emailTemplates/logoblue.png`,
          cid: 'logo',
        },
      ],
    }
    await emailTemplate.sendMail(options)
    return res.status(200).json({message: "status update successfully"});
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
