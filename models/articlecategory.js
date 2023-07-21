const mongoose = require('mongoose');

const articleCategorySchema = new mongoose.Schema({
    id:{ type: String, required: true },
    article_id: { type: String, required: true },
    category_id: { type: String, required: true },
  },
  {
    timestamps: true
  });

module.exports = mongoose.model('ArticleCategory', articleCategorySchema,'clonearticlecategory');