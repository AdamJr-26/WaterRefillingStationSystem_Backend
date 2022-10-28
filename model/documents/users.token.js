const Schema = require("mongoose").Schema;


const userToken= Schema({
    userId: {
        type:Schema.Types.ObjectId,
        require: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 30 * 8600, //30 days
    },
    
});

// stationsSchema.plugin(passportLocalMongoose)

module.exports = userToken ;
