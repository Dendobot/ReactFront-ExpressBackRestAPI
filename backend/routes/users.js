const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();



router.use(bodyParser.json()); //Handles JSON requests
router.use(bodyParser.urlencoded({ extended: false }));


//login handle
router.get('/login', async (req, res) => {

  //res.render('login')
});
router.get('/register', (req, res) => {
  //res.render('register')
  console.log(req.body.hello);
  res.send("haah");
});
//Register handle

router.post('/register', async (req, res) => {
  console.log('register request recieved\nuser: ' + req.body.user + ' password: ' + req.body.pwd);

  User.findOne({ username: req.body.user }).exec((err, user) => {
    console.log(user);
    if (user) {
      //code 409 to indicate username taken
      return res.status(409).send({
        message: 'This is an error!'
      });
    }
    else {
      const newUser = new User({
        username: req.body.user,
        password: req.body.pwd
      });

      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt,
          (err, hash) => {
            if (err) throw err;
            //save pass to hash
            newUser.password = hash;
            //save user
            newUser.save()
              .then((value) => {
                console.log(value);
                res.status(201).json({ 'success': `New Recipe ${user} created!` });
              })
              .catch(value => {
                console.log(value);
                res.status(500).json({ 'message': err.message });
              });
          }));

    }
  });



});

//authorise a user and sends a jwt back
router.post('/auth', async (req, res, next) => {
  console.log('auth request recieved\nuser: ' + req.body.user + ' password: ' + req.body.pwd);
  const { user, pwd } = req.body;
  var username = user;
  var password = pwd;
  if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

  const foundUser = await User.findOne({ username: username }).exec();
  if (foundUser) {
    console.log('found user in db');
  }
  if (!foundUser) return res.sendStatus(401); //Unauthorized 
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' }
    );
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    // Creates Secure Cookie with refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });

    // Send authorization roles and access token to user
    res.json({ accessToken });
  } else {
    console.log('no match for pwd');
    res.sendStatus(401);
  }
});


//refresh token
router.get('/refresh', async (req, res) => {
  console.log("refresh request found");
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  console.log(cookies);
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden 
  // evaluate jwt 
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": decoded.username,
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
      );
      res.json({ accessToken });
    }
  );
});

router.get('/logout', async (req, res) => {
  console.log("Sign Out request found");
  const cookies = req.cookies;
  console.log(cookies.jwt);
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
});

module.exports = router;