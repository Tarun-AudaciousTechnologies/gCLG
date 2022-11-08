const {Schema, model} = require('mongoose');

const faqModel = new Schema({
    question: {
        type: Schema.Types.String
    },
    answers: {
        type: Schema.Types.String
    },
    status: {
        type: Schema.Types.String,
        enum: [
            'active', 'inactive'
        ],
        default: "active"
    }
}, {timestamps: true})

module.exports = model('Faq', faqModel, 'Faq')
