const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const staffSchema = schema({
    email:{
        type: String,
        required:true
    },
    mobile:{
        type: Number,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    name:{
        type: String,
        required: true
    },
    number:{
        type: Number
    },
    registered:{
        type: Boolean,
        default: false,
        required: false
    },
    de_time: {
        type: String
    },
    branchCode:{
      type:String
    },
    image:{
      type: String
    }
});

const staff = module.exports = mongoose.model('DeStaff',staffSchema);
