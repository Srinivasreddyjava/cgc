const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const DummySchema = schema({
    tasks : {
        type: Array
    }
});

module.exports = mongoose.model('Dummy', DummySchema);