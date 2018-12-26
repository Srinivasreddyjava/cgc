const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const ChildTasksSchema = schema({
    child_id:{
        type: String
    },
    tasks:{
        type: Array
    },
});

module.exports = mongoose.model('ChildTasks', ChildTasksSchema);