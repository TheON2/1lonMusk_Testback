const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    id:{ type: String, required: true },
    image_url:{ type: String, required: false },
    title:{ type: String, required: false },
    category: { type: String, required: true },
    article_date: { type: String, required: true },
  },
  {
    timestamps: true
  });

module.exports = mongoose.model('Article', articleSchema,'clonearticle');