const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({
      timestamp: new Date(),
      status: 400,
      error: "auth_003",
      message: "Unable to issue access tokens"
    });
  }
}

module.exports = auth;
