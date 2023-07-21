const mongoose = require('mongoose');

// Define Schemes
const likeSchema = new mongoose.Schema({
    id:{ type: String, required: true },
    user_id: { type: String, required: true},
    article_id: { type: String, required: true },
  },
  {
    timestamps: true
  });

module.exports = mongoose.model('Like', likeSchema,'clonelike');