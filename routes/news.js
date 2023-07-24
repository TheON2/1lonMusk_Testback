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
        const posts = await Article.find({content: {$regex: q}}).skip(skip).limit(limit);
        const totalPosts = await Article.countDocuments({content: {$regex: q}});
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({ content: posts, totalPages,totalElements: totalPosts });
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
    const page = parseInt(req.query.page, 10);
    const limit = 12;
    const skip = (page - 1) * limit;
    try {
      const totalPosts = await Article.countDocuments();
      const totalPages = Math.ceil(totalPosts / limit);
      const posts = await Article.find().skip(skip).limit(limit);

      res.status(200).json({ content: posts, totalPages,totalElements: totalPosts });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/likes', async (req, res) => {
    const page = parseInt(req.query.page, 10);
    const limit = 12;
    const skip = (page - 1) * limit;
    try {
      const token = req.cookies.refreshToken;
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const likes = await Like.find({ user_id: decoded.email });

      const likedArticleIds = likes.map(like => like.article_id);

      const totalPosts = await Article.countDocuments({ '_id': { $in: likedArticleIds } });
      const totalPages = Math.ceil(totalPosts / limit);

      const posts = await Article.find({
        '_id': { $in: likedArticleIds }
      })
        .select('_id title content image_url category articleDate') // 필요한 필드만 선택
        .skip(skip).limit(limit);

      res.status(200).json({ content: posts, totalPages,totalElements: totalPosts });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/reads', async (req, res) => {
    const page = parseInt(req.query.page, 10);
    const limit = 12;
    const skip = (page - 1) * limit;
    try {
      const token = req.cookies.refreshToken;
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const reads = await UserReadArticle.find({ user_id: decoded.email });

      const readsArticleIds = reads.map(read => read.article_id);

      const totalPosts = await Article.countDocuments({ '_id': { $in: readsArticleIds } });
      const totalPages = Math.ceil(totalPosts / limit);

      const posts = await Article.find({
        '_id': { $in: readsArticleIds }
      })
        .select('_id title content image_url category articleDate') // 필요한 필드만 선택
        .skip(skip).limit(limit);

      res.status(200).json({ content: posts, totalPages,totalElements: totalPosts });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  const longSentence ='새 것은 얼음과 가진 구할 것이다. 않는 거친 투명하되 바이며, 곧 교향악이다. 이는 청춘 이 희망의 청춘 심장의 보라. 만천하의 하는 싸인 품으며, 아름답고 끝까지 때문이다. 실로 인생을 구할 없으면, 이상은 쓸쓸한 인생에 교향악이다. 귀는 곧 풍부하게 없으면, 품으며, 있는 들어 아름답고 인간은 말이다. 지혜는 보내는 청춘에서만 트고, 피가 있는 끓는다. 보배를 위하여 풍부하게 그들을 것이다. 풍부하게 별과 가치를 청춘 가는 눈이 끓는 커다란 인간에 뿐이다. 뼈 되려니와, 인생에 눈이 힘있다.\n' +
    '\n' +
    '때까지 원질이 것은 아니다. 불러 하였으며, 곳으로 싸인 것이다.보라, 보라. 이상의 얼마나 만물은 돋고, 말이다. 넣는 청춘의 시들어 타오르고 가슴에 부패뿐이다. 맺어, 설산에서 따뜻한 전인 것이다. 인간의 심장은 얼마나 행복스럽고 피부가 교향악이다. 인생에 예가 장식하는 가슴에 그들은 더운지라 우는 피고 그리하였는가? 있을 생의 있는 노년에게서 품으며, 소리다.이것은 자신과 힘차게 것이다. 있는 위하여 크고 봄날의 얼마나 것이다. 우리는 뜨거운지라, 옷을 내려온 끝까지 하여도 광야에서 아름다우냐? 품었기 피부가 그들은 봄날의 싹이 천지는 그들의 것이다.\n' +
    '\n' +
    '거친 피어나는 군영과 열락의 구하지 그들은 봄바람이다. 이상을 천자만홍이 밝은 풀이 투명하되 것이다. 찾아다녀도, 청춘에서만 얼마나 쓸쓸한 이상이 너의 얼마나 가슴에 교향악이다. 방황하였으며, 이상의 속에 설산에서 듣기만 원질이 청춘에서만 이상 무한한 이것이다. 석가는 싹이 청춘의 인류의 교향악이다. 열매를 전인 그와 용기가 놀이 피에 운다. 위하여서, 예수는 때에, 날카로우나 것이다. 불어 원대하고, 소금이라 그것을 예가 아니더면, 위하여서. 굳세게 거친 피에 생명을 이상의 것이다.보라, 아름다우냐?\n' +
    '\n' +
    '심장은 만물은 가장 현저하게 가슴에 무엇을 듣는다. 찾아다녀도, 청춘은 대고, 인생에 못할 피가 피가 피고, 이상의 아니다. 든 불어 굳세게 용기가 거선의 사라지지 있으랴? 인간의 피가 커다란 인생을 청춘 밝은 듣는다. 그들을 몸이 얼음에 되는 가진 때문이다. 거친 황금시대를 이것이야말로 구하지 일월과 하는 붙잡아 몸이 커다란 운다. 같이 돋고, 목숨이 위하여, 것이다. 꾸며 그들에게 가는 우는 미인을 뿐이다. 품에 끝까지 천지는 같은 그러므로 목숨이 위하여서.\n' +
    '\n' +
    '튼튼하며, 얼마나 못하다 쓸쓸하랴? 자신과 품으며, 피가 피가 보이는 피고 말이다. 심장은 위하여서 가는 싹이 싶이 별과 있는 목숨이 청춘의 아름다우냐? 우는 것이다.보라, 군영과 크고 이상 이상, 목숨이 사막이다. 소리다.이것은 이는 그것은 운다. 목숨이 이 끝까지 희망의 자신과 사랑의 이것이다. 피어나는 인생의 그들에게 청춘의 뿐이다. 튼튼하며, 굳세게 뜨거운지라, 소담스러운 같이, 봄바람이다. 인도하겠다는 이것을 위하여서 열락의 것이다. 이상의 끝까지 길지 예가 쓸쓸하랴? 청춘의 그것은 방지하는 그들은 못하다 보이는 그들의 말이다.\n' +
    '\n' +
    '보이는 대한 풍부하게 가치를 맺어, 수 열락의 봄바람이다. 들어 청춘을 날카로우나 고행을 약동하다. 우리는 없는 보는 이상 있다. 그들의 하였으며, 오직 그들에게 주며, 그들의 뜨고, 것이다. 설레는 원대하고, 얼마나 아름다우냐? 하여도 무엇을 같은 예수는 안고, 간에 가는 할지니, 말이다. 행복스럽고 가지에 같지 수 뼈 쓸쓸한 얼음 얼음에 관현악이며, 봄바람이다. 풀밭에 그것은 더운지라 철환하였는가? 충분히 그들의 곳으로 뛰노는 약동하다. 힘차게 끓는 공자는 보내는 인간에 피가 말이다.\n' +
    '\n' +
    '장식하는 무엇이 굳세게 청춘을 붙잡아 갑 우리 남는 있는가? 품고 얼마나 실현에 피고 맺어, 싹이 이것이다. 반짝이는 하였으며, 힘차게 소금이라 얼마나 청춘 부패뿐이다. 오아이스도 구할 피가 생의 인간에 투명하되 아니다. 어디 구할 가슴에 시들어 우리 것은 같은 것이다. 위하여서 못하다 크고 곧 꽃이 피다. 그들에게 실현에 그들의 아름답고 하는 같이, 그와 가슴이 때문이다. 바이며, 두손을 굳세게 위하여서 전인 그림자는 것이다. 품고 하는 있는 우리는 이것이다. 과실이 듣기만 불러 것은 피에 천고에 갑 인류의 것이다.\n' +
    '\n' +
    '방황하였으며, 실현에 보이는 수 가치를 갑 속에 인간에 있는가? 더운지라 주는 피가 그들에게 힘있다. 우리의 원질이 얼음과 그들은 희망의 긴지라 곧 주며, 그들의 칼이다. 인생의 하여도 없는 기관과 길지 하는 것이다. 끝까지 눈이 곧 산야에 바이며, 위하여, 것이다. 못할 붙잡아 많이 얼음에 안고, 때문이다. 인류의 간에 우리는 별과 우리의 보배를 품고 힘있다. 간에 위하여서 발휘하기 온갖 꾸며 같이 황금시대의 이것이다. 있는 목숨이 그들은 그들은 끝에 있는 산야에 끓는다. 안고, 몸이 때에, 같은 뼈 얼음이 오직 힘있다.\n' +
    '\n' +
    '곳이 지혜는 커다란 것이다. 들어 귀는 인간은 구하지 철환하였는가? 사라지지 속에 있으며, 교향악이다. 아름답고 방황하여도, 무한한 미묘한 사막이다. 방지하는 실현에 발휘하기 그들의 영락과 구할 황금시대다. 있을 꽃 천하를 하여도 대한 두손을 싶이 내려온 것이다.보라, 이것이다. 곳으로 황금시대를 그것을 거친 뛰노는 같이 뜨거운지라, 석가는 이상의 이것이다. 노래하며 그것을 대고, 봄바람을 피다. 사라지지 이 청춘이 보이는 청춘의 용감하고 힘있다.\n' +
    '\n' +
    '얼음이 심장은 광야에서 피가 그리하였는가? 맺어, 밝은 뭇 없으면 힘차게 아름다우냐? 품으며, 위하여서 발휘하기 노래하며 사랑의 약동하다. 더운지라 위하여 꾸며 우리의 위하여, 힘있다. 사라지지 이 가지에 만물은 피가 낙원을 사막이다. 산야에 소리다.이것은 우리 같은 청춘에서만 따뜻한 것이다. 관현악이며, 평화스러운 천고에 있는 끓는다. 품었기 청춘 같이 인간의 용기가 봄바람이다. 만천하의 같이, 귀는 용기가 인생의 밝은 찬미를 품었기 하여도 것이다.\n' +
    '\n' +
    '우리 심장은 구할 기관과 청춘은 많이 돋고, 그들의 밥을 있다. 천자만홍이 타오르고 심장의 힘차게 얼마나 광야에서 것이다. 같은 뭇 행복스럽고 것이다. 인간의 같이 꽃이 품고 것이다. 때에, 맺어, 불러 철환하였는가? 가슴이 물방아 맺어, 이상 것이다. 피가 싸인 끓는 웅대한 이상의 노래하며 피는 그리하였는가? 듣기만 인생을 피에 같으며, 있는가? 굳세게 튼튼하며, 그들을 구하지 속잎나고, 그와 꽃이 커다란 것이다. 끝까지 구하기 웅대한 봄바람이다. 얼음 청춘 노년에게서 동력은 싶이 청춘은 얼마나 쓸쓸하랴?\n' +
    '\n' +
    '모래뿐일 얼음 자신과 예가 피가 주는 것이다. 같은 튼튼하며, 목숨이 부패를 그들에게 풀이 충분히 우리 것이다. 무엇을 어디 충분히 우리는 그들의 생의 이것이다. 거친 가는 길을 없으면 굳세게 살았으며, 바이며, 기관과 이상의 칼이다. 일월과 보이는 것은 피가 아름다우냐? 발휘하기 미인을 위하여서, 있는가? 새가 방지하는 옷을 이상의 봄날의 살았으며, 봄바람이다. 곳이 물방아 만물은 구할 같지 미인을 사라지지 이것이다. 우리 같이 것이다.보라, 설산에서 구하지 힘있다. 보배를 물방아 목숨이 끓는 있는 새 구하지 듣는다.\n' +
    '\n' +
    '가장 자신과 이 위하여서, 그림자는 우는 힘있다. 그들에게 뼈 고동을 따뜻한 예가 그들은 기관과 소리다.이것은 힘있다. 끓는 그것을 뭇 얼마나 듣는다. 오아이스도 무한한 동산에는 것이다. 무엇을 곧 그들의 교향악이다. 방황하였으며, 곳이 인간에 날카로우나 뜨거운지라, 끝에 할지라도 듣기만 힘있다. 피는 든 생생하며, 바이며, 돋고, 대중을 같으며, 맺어, 앞이 것이다. 따뜻한 이성은 피부가 소담스러운 찬미를 인생을 우리 맺어, 피다. 인생의 고행을 수 것은 인류의 현저하게 속에 설산에서 아니다. 눈이 있을 살 방황하였으며, 사랑의 때까지 얼마나 싸인 없으면 그리하였는가? 싹이 무엇을 구하기 사막이다.\n' +
    '\n' +
    '않는 같은 장식하는 트고, 이상의 커다란 같이, 것이다. 들어 피부가 원질이 든 많이 품에 속에서 아니다. 같이 품에 굳세게 새가 그들은 칼이다. 웅대한 천지는 두기 옷을 시들어 때문이다. 넣는 방황하였으며, 같은 속에 살았으며, 운다. 석가는 현저하게 청춘의 속에 천지는 보라. 못하다 끝에 꽃이 아름답고 얼음 속에서 얼마나 든 약동하다. 그들은 그들의 싶이 것이다. 무엇을 듣기만 모래뿐일 반짝이는 밝은 얼마나 우리 기관과 사막이다. 우리의 위하여서, 아니한 몸이 쓸쓸하랴? 사람은 때까지 광야에서 능히 가치를 구하기 있다.\n' +
    '\n' +
    '대고, 인생의 방지하는 있는 없으면 반짝이는 그들은 일월과 말이다. 얼마나 넣는 구하지 아니더면, 이상 거선의 그들의 우리 놀이 칼이다. 능히 소금이라 따뜻한 군영과 새가 행복스럽고 아름다우냐? 것은 인생의 쓸쓸한 봄바람이다. 가치를 되는 그러므로 것이다. 할지라도 청춘이 위하여 없으면 구하지 듣는다. 고행을 것은 그들의 사막이다. 얼음이 이상 피가 원대하고, 못하다 것은 이는 있으랴? 끝까지 그와 피고, 불러 힘있다. 아니더면, 자신과 싶이 인생의 말이다.\n' +
    '\n' +
    '인도하겠다는 영락과 긴지라 바이며, 찾아 위하여, 봄바람이다. 풀이 내는 봄날의 힘있다. 무엇을 뛰노는 튼튼하며, 인생에 생명을 있는 위하여 남는 천자만홍이 약동하다. 남는 되는 찾아 것은 튼튼하며, 주는 보는 힘차게 사막이다. 생명을 우리는 풀이 속잎나고, 봄바람이다. 긴지라 광야에서 만천하의 것이다. 스며들어 들어 위하여, 교향악이다. 설레는 더운지라 것이다.보라, 피다. 같이, 소금이라 현저하게 갑 몸이 힘있다. 피고, 온갖 영원히 끝에 만천하의 곳이 그림자는 뿐이다.\n' +
    '\n' +
    '이것을 속잎나고, 만물은 안고, 할지라도 든 기관과 싸인 그들의 피다. 천자만홍이 쓸쓸한 무엇을 이 어디 피가 있음으로써 것이다. 눈이 그러므로 얼음에 맺어, 미묘한 길지 우리 얼음과 것이다. 하는 낙원을 피가 교향악이다. 하여도 생생하며, 그러므로 설산에서 아름다우냐? 것은 가는 길을 사랑의 그들의 위하여서 할지니, 위하여 이성은 칼이다. 무한한 피가 바로 평화스러운 같으며, 가는 현저하게 보라. 품었기 더운지라 천고에 우리 얼음과 것이다. 고동을 시들어 실현에 부패를 구하지 용감하고 광야에서 운다.\n' +
    '\n' +
    '위하여 있는 것은 수 가진 아름다우냐? 커다란 청춘에서만 타오르고 바이며, 얼마나 쓸쓸한 튼튼하며, 있는 쓸쓸하랴? 무엇을 맺어, 피가 앞이 아니더면, 때문이다. 있는 두손을 불러 되는 철환하였는가? 예가 그들은 그러므로 이것이다. 아름답고 고행을 보배를 풀이 시들어 있는가? 우리는 봄바람을 동력은 이것이야말로 사는가 보내는 뿐이다. 봄바람을 노년에게서 이는 위하여, 위하여서, 속에 스며들어 품었기 위하여서. 따뜻한 청춘을 아름답고 방황하였으며, 얼마나 봄바람이다.\n' +
    '\n' +
    '찬미를 과실이 붙잡아 미묘한 뿐이다. 하는 가치를 그들을 예수는 인생에 사라지지 살 것이다. 같이, 스며들어 얼음이 크고 피어나는 청춘의 이것을 얼음과 용기가 약동하다. 커다란 시들어 그들은 속잎나고, 뿐이다. 불어 위하여서, 많이 되려니와, 길지 노래하며 긴지라 있으며, 것이다. 길지 그들은 풍부하게 용감하고 관현악이며, 이성은 때에, 봄바람이다. 새 가는 남는 구하기 사라지지 위하여 사막이다. 불어 노래하며 보내는 꽃 보이는 않는 위하여서. 봄날의 가지에 되려니와, 인간의 우는 커다란 가는 황금시대다. 열매를 밝은 이상을 눈이 인생에 무한한 위하여서 주며, 힘있다.\n' +
    '\n' +
    '사람은 위하여, 예수는 우는 때문이다. 못하다 가치를 할지니, 같이, 무엇을 않는 위하여 유소년에게서 황금시대다. 사람은 날카로우나 인류의 할지라도 기쁘며, 끝까지 부패뿐이다. 아니한 너의 새가 피부가 때까지 할지니, 그것을 위하여 뿐이다. 동력은 심장의 가는 간에 인간이 역사를 생의 이상의 것이다. 보는 주는 위하여서, 오아이스도 인간은 예수는 소리다.이것은 바로 곧 부패뿐이다. 가치를 같은 그들은 보내는 간에 못하다 이상의 뜨거운지라, 꽃이 힘있다. 방지하는 타오르고 아니더면, 이는 때문이다. 인간의 이상의 위하여 살 목숨을 원대하고, 수 품에 그들은 것이다. 긴지라 청춘 뼈 듣는다.'
  const words = longSentence.split(' ');
  const categories = ["테슬라", "트위터", "페이팔", "스페이스x", "X.AI", "도지코인", "뉴럴링크", "하이퍼루프", "솔라시티", "스타링크"];

  function getRandomContent(words, numWords) {
    let content = '';
    for (let i = 0; i < numWords; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      content += words[randomIndex] + ' ';
    }
    return content.trim();
  }
  app.get('/api/test/dummy', async (req, res) => {

    async function createArticles(num) {
      for (let i = 1; i <= num; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const content = getRandomContent(words, 100);
        const article = new Article({
          id: i.toString(),
          image_url: "https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg",  // 직접 이미지 URL을 제공해야 합니다.
          title: "Dummy article title " + i,
          content: content,
          category: category,
          article_date: new Date().toISOString(),
        });
        await article.save();
      }
    }
    createArticles(100).then(() => {
      res.status(200).json({ message: "success" });
    });
  });
}
