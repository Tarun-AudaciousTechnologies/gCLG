const {Schema, model} = require("mongoose");
const { schema } = require("./complaint");

const userSchema = new Schema({
    name: {
        type: Schema.Types.String
    },
    age: {
        type: Schema.Types.Number
    },
    email: {
        type: Schema.Types.String
    },
    password: {
        type: Schema.Types.String
    },  
    phone: {
        type: Schema.Types.String
    },
    street_address: {
        type: Schema.Types.String
    },
    city: {
        type: Schema.Types.String,
        enum: ['Indore']
    },
    userType: {
        type: Schema.Types.String,
        enum: ['user','admin','superAdmin'],
        default: 'user'
    },
    status: {
        type: Schema.Types.String,
        enum: ['active','inactive'],
        default: 'active'
    }
},{timestamps: true})

module.exports = model('user', userSchema, 'user');