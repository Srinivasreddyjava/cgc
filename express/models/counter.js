const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CounterSchema = schema({
    _id:String,
    sequence_value:Number
});

module.exports = mongoose.model('Counter',CounterSchema);
