const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const ChildSchema = schema({
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
        type:String
    },
    parent_mobile:{
        type: Number
    },
    added_time:{
        type: String
    },
    staff:{
        type: String
    },
    de_time:{
      type: String
    }
});

module.exports = mongoose.model('DeChild', ChildSchema);