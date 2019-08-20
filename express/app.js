// Importing modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const app = express();

// port
const port = 3030;

// cors
app.use(cors());

app.use(bodyParser.json({limit: '5mb'}));
// Passport
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

const users = require('./routes/users');
app.use('/users', users);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, () => {
    console.log('Server logged on ' + port);
});

// Mongoose
mongoose.connect(config.database,{ useNewUrlParser: true });
mongoose.set('debug',true);
mongoose.connection.on('connected',()=>{
    // console.log('connected to database '+ config.database);
});
// Display error if any
mongoose.connection.on('error', (err) => {
    if (err) {
        // console.log('Error' + err);
    }
});
