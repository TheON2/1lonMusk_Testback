const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

function refreshauth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(503).send('리프레시 토큰이 만료되었습니다.');
  }
}

module.exports = refreshauth;
