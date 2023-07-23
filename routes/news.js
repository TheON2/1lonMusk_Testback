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

module.exports = function (app, UserReadArticle,User,Like,Article) {
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

  app.get('/api/main', async (req, res) => {
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

  const categories = ["테슬라", "트위터", "페이팔", "스페이스x", "X.AI", "도지코인", "뉴럴링크", "하이퍼루프", "솔라시티", "스타링크"];

  app.get('/api/test/dummy', async (req, res) => {

    async function createArticles(num) {
      for (let i = 1; i <= num; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const article = new Article({
          id: i.toString(),
          image_url: "https://avatars.githubusercontent.com/u/32028454?v=4",  // 직접 이미지 URL을 제공해야 합니다.
          title: "Dummy article title " + i,
          content: "This is a dummy article. This is content number " + i + ".",
          category: category,
          article_date: new Date().toISOString(),
        });
        await article.save();
      }

      console.log(`Successfully created ${num} articles.`);
    }

    createArticles(100).then(() => {
      res.status(200).json({ message: "success" });
    });
  });
}
