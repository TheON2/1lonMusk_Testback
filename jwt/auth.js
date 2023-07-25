const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

function auth(req, res, next) {
  const token = req.cookies.accessToken.slice(7);
  if (!token) return res.status(501).send('Access denied. No token provided.');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.cookie('accessToken', '', { expires: new Date(0), httpOnly: true, sameSite: 'None', secure: true });
    res.status(400).json({
      timestamp: new Date(),
      status: 400,
      error: "auth_003",
      message: "Unable to issue access tokens"
    });
  }
}

module.exports = auth;
