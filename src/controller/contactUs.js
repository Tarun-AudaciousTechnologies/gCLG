const {contactUsModel} = require('../models');
const {successHandler, errorHandler} = require('../helper/responseHandler');
const {allConstants, allStatus} = require('../constant');
const {emailHelper} = require('../helper');
const fs = require('fs');
const Handlebars = require('handlebars');

/**
 * @api {Post} /contact/ ContactUs User information
 * @apiName addToContactUs
 * @apiGroup ContactUs
 *
 * @apiBody {String} name name of the User.
 * @apiBody {String} message message of the User.
 * @apiBody {String} email email of the User.
 * @apiBody {String} phone phone of the User.
 * @apiBody {String} companyName companyName of the User.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 created
 *     {
 *       "message":"Thanks for contacting us. We will be in touch with you shortly!"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 internal server error
 *     {
 *       "message": "internal server error"
 *     }
 */

const addToContactUs = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            message,
            phone
        } = req.body;
        const user = await contactUsModel.create([{
                firstName,
                lastName,
                email,
                message,
                phone
            }]);
        const htmlRequest = await fs.readFileSync(`${__dirname}/../emailTemplates/contactUs.html`, 'utf8');
        const template = Handlebars.compile(htmlRequest);
        const replacements = {
            firstName,
            lastName,
            email,
            message,
            phone
        };
        const htmlToSends = template(replacements);
        const options = {
            from: process.env.USER_NAME,
            to: process.env.TO_EMAIL,
            subject: allConstants.CONTACT_US_SUBJECT,
            html: htmlToSends,
            attachments: [
                {
                  filename: 'logo.png',
                  path: __dirname + `/../emailTemplates/logoblue.png`,
                  cid: 'logo',
                },
              ],
        };
        await emailHelper.sendMail(options);
        const htmlRequests = await fs.readFileSync(`${__dirname}/../emailTemplates/thankYou.html`, 'utf8');
        const templates = Handlebars.compile(htmlRequests);
        const htmlToSend = templates();
        const option = {
            from: process.env.USER_NAME,
            to: email,
            subject: allConstants.CONTACT_US_SUBJECT,
            html: htmlToSend,
            attachments: [
                {
                  filename: 'logo.png',
                  path: __dirname + `/../emailTemplates/logoblue.png`,
                  cid: 'logo',
                },
              ],
        };
        await emailHelper.sendMail(option);
        return successHandler(res, allStatus.OK, allConstants.CONTACT_US_SUCCESS_MSG);
    } catch (error) {
        console.log(error,"error");
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.ERR_MSG);
    };
};

/**
 * @api {get} /contact/ ContactUs User information
 * @apiName getDetail
 * @apiGroup ContactUs
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 ok
 *     {
 *       "message":"Detail found successfully"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 internal server error
 *     {
 *       "message": "internal server error"
 *     }
 */

const getDetail = async (req,res)=>{
    try {
        const data = await contactUsModel.find();
        return successHandler(res, allStatus.OK, allConstants.DETAILS_FOUND, data)
    } catch (error) {
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.ERR_MSG)
    }
}

/**
 * @api {get} /contact/:id/ ContactUs User information
 * @apiName getDetailById
 * @apiGroup ContactUs
 * @apiParam {Number} id id of contactUs page
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 ok
 *     {
 *       "message":"found record"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 internal server error
 *     {
 *       "message": "internal server error"
 *     }
 */

const getDetailById = async (req,res)=>{
    try {
        const {id} = req.params
        const data = await contactUsModel.findById({_id: id});
        if(!data){
            return successHandler(res, allStatus.BAD_REQUEST, allConstants.INVALID_ID)
        }
        return successHandler(res, allStatus.OK, allConstants.DETAILS_FOUND, data)
    } catch (error) {
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.ERR_MSG)
    }
}

module.exports = {
    addToContactUs,
    getDetail,
    getDetailById
}