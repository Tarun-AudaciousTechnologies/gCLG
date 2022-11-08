const {Schema, model} = require('mongoose');

const contactUsModel = new Schema({
    firstName: {
        type: Schema.Types.String
    },
    lastName: {
        type: Schema.Types.String
    },
    email: {
        type: Schema.Types.String
    },
    phone: {
        type: Schema.Types.String
    },
    message: {
        type: Schema.Types.String
    },
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now
    }
});

module.exports = model('contact_us', contactUsModel, 'contact_us');
