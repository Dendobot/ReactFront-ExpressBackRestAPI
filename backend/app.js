const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 3500;
const verifyJWT = require("./config/verifyJWT");
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');

//mongoose
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected,,'))
  .catch((err) => console.log(err));



//BodyParser
app.use(bodyParser.json()); //Handles JSON requests
app.use(bodyParser.urlencoded({ extended: false })); //Handles normal post requests

//middleware for cookie
app.use(cookieParser());


//cors for listenning from different port
app.use(cors(corsOptions));


//Routes
app.use('/users', require('./routes/users'));
app.use('/recipe', require('./routes/recipe'));
//verify token before give access to route
app.use(verifyJWT);
app.use('/admin', require('./routes/admin'));

//verify token first

//app.use('/dashboard', require('./routes/dashboard'));

app.listen(PORT, function () {
  console.log("server is listening on port: " + PORT);
});