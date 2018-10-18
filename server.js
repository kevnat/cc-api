const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const API = require('./routes/authRouter');

// const db = require('/.models');


mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/payments')
    .then(() => { // if all is ok we will be here
      console.log('Start');
    })
    .catch(err => { // if error we will be here
        console.error('App starting error:', err.stack);
        process.exit(1);
    });


// Use middlewares to post json data to the server
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('client/build'));
app.use(API);

app.get('/', function(req, res) {
    res.send('home');
});

app.use('/api', API)

app.listen(PORT, function(){
  console.log(`Server listening on port: ${PORT}.`);
})

module.exports = app;