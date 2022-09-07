const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Recipe = require('../models/recipe.js');



router.use(bodyParser.json()); //Handles JSON requests
router.use(bodyParser.urlencoded({ extended: false }));

//dashboard
router.get('/', async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden

  var user_requested = foundUser.username;
  const recipeNameArray = new Array();
  const recipeIdArray = new Array();

  console.log("request this user's recipe: " + user_requested);
  try {
    const user = await User.findOne({ username: user_requested }).exec();
    console.log("user found " + user.username);

    try {
      for await (const rid of user.recipes) {
        const recipe = await Recipe.findOne({ id: rid }).exec();
        recipeNameArray.push(recipe.recipeName);
        recipeIdArray.push(recipe.id);
      }

      const response = {
        recipeIdArray,
        recipeNameArray
      };
      var responseJSON = JSON.stringify(response, {
        headers: { 'Content-Type': 'application/json' },
      });
      res.json(responseJSON);


    } catch (err) {
      res.status(500).json({ 'message': err.message });

    }
  } catch (err) {
    res.status(500).json({ 'message': err.message });
  }
});

router.get('/viewRecipe', async (req, res) => {
  var id = req.query.id;

  try {
    const recipe = await Recipe.findOne({ id: id }).exec();
    if (recipe) {

      res.render('viewRecipe', {
        recipe: recipe
      });
    }
  } catch (err) {
    throw err;
  }


});


router.post('/createRecipe', async (req, res) => {

  const { user, recipeName, intro, ingredients, method } = req.body;

  //new recipe
  User.findOne({ username: user }).exec((err, user) => {
    if (user) {
      const newRecipe = new Recipe({
        recipeName: recipeName,
        intro: intro,
        ingredients: ingredients,
        method: method,
        id: mongoose.mongo.ObjectId().toString()
      });
      newRecipe.save()
        .then((value) => {
          user.recipes.push(newRecipe.id);
          user.save()
            .then((value) => {
              res.status(201).json({ 'success': `New user ${newRecipe} created!` });
              console.log('successfully created a recipe');
            }).catch(value => {
              console.log(value);
              res.status(500).json({ 'message': err.message });
            });
        }).catch(value => {
          console.log(value);
          res.status(500).json({ 'message': err.message });
        });
    }
  });

});

module.exports = router; 