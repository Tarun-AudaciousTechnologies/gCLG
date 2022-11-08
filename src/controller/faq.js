const {faqModel} = require('../models')
const {successHandler, errorHandler} = require('../helper/responseHandler')
const {allConstants, allStatus} = require('../constant')
const {pagination} = require('../helper')

/**
 * @api {Post} /faq/add addFaq information
 * @apiName addFaq
 * @apiGroup FAQ
 *
 * @apiBody {String} question question of the FAQ.
 * @apiBody {String} answers answers of the FAQ.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 created
 *    {
 *  "message": "successfully Created!"
 *     }
 * @apiError internal server error.
 *
 */

const addFaq = async (req, res) => {
    try {
        const {question, answers} = req.body
        await faqModel.create([{
                question,
                answers
            }])
        return successHandler(res, allStatus.CREATED, allConstants.SIGNUP_SUB);
    } catch (error) {
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.ERR_MSG);
    };
};

/**
 * @api {get} /faq/ showFaq information
 * @apiName showFaq
 * @apiGroup FAQ
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 ok
 *    {
 *  "message": "found record"
 * "result": [
 *       {
 *           "_id": "6229c5be770040776f23e081",
 *           "question": " what is your website name?",
 *           "answers": "website name is audacious technologies",
 *           "createdAt": "2022-03-10T09:32:46.227Z",
 *           "updatedAt": "2022-03-10T10:02:05.853Z",
 *           "__v": 0
 *       }
 *   ]
 *     }
 * @apiError internal server error.
 *
 */

const showFaq = async (req, res) => {
    try {
        const {offset, limits} = pagination.paginationData(req.query)
        const data = await faqModel.find().skip(`${offset}`).limit(`${limits}`);
        return successHandler(res, allStatus.OK, allConstants.GET_MSG, data)
    } catch (error) {
        console.log(error)
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.ERR_MSG)
    }
}

/**
 * @api {post} /faq/update/:id updateFaq information
 * @apiName updateFaq
 * @apiGroup FAQ
 * @apiParam {Number} id Id of the FAQ.
 * @apiBody {String} question question of the FAQ.
 * @apiBody {String} answers answers of the FAQ.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 ok
 *    {
 *  "message": "successfully updated"
 *     }
 * @apiError internal server error.
 *
 */

const updateFaq = async (req, res) => {
    try {
        const {id} = req.params
        const {question, answers} = req.body
        await faqModel.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                question,
                answers
            }
        })
        return successHandler(res, allStatus.OK, allConstants.SUCCESSFULLY_UPDATED)
    } catch (error) {
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.ERR_MSG)
    }
}

/**
 * @api {delete} /faq/delete/:id deleteFaq information
 * @apiName deleteFaq
 * @apiGroup FAQ
 * 
 * @apiParam {Number} id Id of the FAQ.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 ok
 *    {
 *  "message": "successfully deleted"
 *     }
 * @apiError internal server error.
 *
 */

const deleteFaq = async (req, res) => {
    try {
        const {id} = req.params
        await faqModel.findByIdAndDelete({_id: id})
        return successHandler(res, allStatus.OK, allConstants.SUCCESSFULLY_DELETED)
    } catch (error) {
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.ERR_MSG)
    }
}

/**
 * @api {put} /faq/update-status/:id updateStatus of FAQ information
 * @apiName updateStatus
 * @apiGroup FAQ
 * @apiParam {Number} id Id of the FAQ.
 * @apiParam {string} status Status of the FAQ.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 ok
 *    {
 *  "message": "successfully updated"
 *     }
 * @apiError internal server error.
 *
 */

const updateStatus = async (req, res) => {
    try {
        const {id} = req.params
        const {status} = req.body
        await faqModel.findOneAndUpdate({
            _id: id
        }, {$set: {
                status
            }})
        return successHandler(res, allStatus.OK, allConstants.SUCCESSFULLY_UPDATED)
    } catch (error) {
        return errorHandler(res, allStatus.INTERNAL_SERVER_ERROR, allConstants.ERR_MSG)
    }
}

module.exports = {
    addFaq,
    deleteFaq,
    updateFaq,
    updateStatus,
    showFaq
}