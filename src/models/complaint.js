const { compareSync } = require("bcrypt");
const {Schema, model} = require("mongoose");

const complaintSchema = new Schema({
    requestedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    area: {
        type: Schema.Types.String
    },
    city: {
        type: Schema.Types.String
    }, 
    complaintType: {
        type: Schema.Types.String,
        enum: ['electricity','water','garbage','road','government school']
    },
    images: {
        type: Schema.Types.Array
    },
    panCard: {
        type: Schema.Types.String
    },
    status: {
        type: Schema.Types.String,
        enum: ['pending','approved','rejected'],
        default: 'pending'
    },
    description: {
        type: Schema.Types.String
    }
},{timestamps: true})

module.exports = model('complaints', complaintSchema, 'complaints');