const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

function extractKeywords(posts) {
  let keywordCounts = {};

  posts.forEach((post) => {
    let words = post.title.split(" ");

    words.forEach((word) => {
      if (keywordCounts[word]) {
        keywordCounts[word]++;
      } else {
        keywordCounts[word] = 1;
      }
    });
  });

  let sortedKeywords = Object.entries(keywordCounts).sort((a, b) => b[1] - a[1]);
  let topKeywords = sortedKeywords.slice(0, 6).map((item) => item[0]);

  return topKeywords;
}

module.exports = function (app, UserReadArticle ,User,Like,Category,ArticleCategory,Article) {
  app.get('/api/search', async (req, res) => {
    const { q, page } = req.query;
    if (q) {
      const limit = 12;
      const skip = (page - 1) * limit;
      try {
        const posts = await Article.find({title: {$regex: q}}).sort({timestamp: -1}).skip(skip).limit(limit);
        res.status(200).json({ result: posts });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    } else {
      try {
        const posts = await Article.find().sort({timestamp: -1}).limit(20);
        const keywords = extractKeywords(posts);
        res.status(200).json({ keyword: keywords });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  });

  app.post('/api/main', async (req, res) => {
    const { page } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;
    try {
      const posts = await Article.find().sort({timestamp: -1}).skip(skip).limit(limit);
      res.status(200).json({ result: posts });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
}
