const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    id:{ type: String, required: true },
    name:{ type: String, required: true }
  },
  {
    timestamps: true
  });

module.exports = mongoose.model('Category', CategorySchema,'clonecategory');