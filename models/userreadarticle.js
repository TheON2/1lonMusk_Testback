const mongoose = require('mongoose');

// Define Schemes
const userReadArticleSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    user_id: {type: String, required: true},
    article_id: {type: String, required: true},
    completion: {type: Boolean, required: true},
  },
  {
    timestamps: true
  });

module.exports = mongoose.model('UserReadArticle', userReadArticleSchema,'clonereadarticle');