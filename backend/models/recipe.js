const mongoose = require('mongoose');
const RecipeSchema = new mongoose.Schema({

  recipeName: {
    type: String,
    required: true
  },
  intro: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }

});
const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;