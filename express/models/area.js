const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const AreaSchema = schema({
    number:{
        type:Number
    },
    name:{
        type:String
    },
    added_time:{
        type: String
    }
});

module.exports = mongoose.model('Area',AreaSchema);