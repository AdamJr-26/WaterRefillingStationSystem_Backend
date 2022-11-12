const Schema = require("mongoose").Schema;


const otp = Schema({
    userId: {
        type:Schema.Types.ObjectId,
        require: true,
    },
    gmail: {
        type: String,
        required: true,
    },
    token:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 500
    },
    
});

module.exports = otp  ;
