const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const staff_schema = schema({
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
        default: true
    },
    branchCode:{
      type:String,
      required:true
    }
});

const staff = module.exports = mongoose.model('staff',staff_schema);

//adduser
module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

//comparePassword
module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}

//getting User by email
module.exports.getUserByEmail = (email, callback) => {
    const query = { email: email }
    Staff.findOne(query, callback);
}

//getting user by Id
module.exports.getUserById = (id, callback) => {
    Staff.findById(id, callback);
}
