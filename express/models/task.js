const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const TaskSchema = schema({
    number: {
        type: Number,
    },
    name:{
        type: String,
    },
    area_id:{
        type: String,
    },
    added_time:{
        type: String
    }
});

module.exports = mongoose.model('Task',TaskSchema);