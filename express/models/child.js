const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const ChildSchema = schema({
    number:{
        type: Number
    },
    first_name:{
        type:String
    },
    last_name:{
        type:String
    },
    age:{
        type: Number
    },
    parent_name:{
        type: String
    },
    parent_mobile:{
        type: Number
    },
    time_slot:{
        type: String
    },
    added_time:{
        type: String
    },
    staff:{
        type: String
    }
});

module.exports = mongoose.model('Child', ChildSchema);