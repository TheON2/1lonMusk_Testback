const bcrypt = require('bcrypt')
const {isNotLoggedIn, isLoggedIn} = require("./middlewares");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const auth = require("../jwt/auth");
const refreshauth = require("../jwt/refreshauth");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

module.exports = function(app, User,UserReadArticle,Like)
{
  app.get('/user/kakao', passport.authenticate('kakao', { authType: 'reprompt' }));

  app.get('/user/kakao/callback', function(req, res, next) {
    passport.authenticate('kakao', async function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect(`${process.env.ORIGIN}/Login`);
      }
      try {
        console.log('몽고유저 조회함 카카오:',user)
        let mongoUser = await User.findOne({ email: user._json.kakao_account.email });
        if (!mongoUser) {
          mongoUser = new User({
            email: user._json.kakao_account.email,
            nickName:user._json.properties.nickname,
            password:user._json.kakao_account.email,
            method:'kakao',
            profileUrl:user._json.properties.thumbnail_image,
            profileContent:'카카오로 회원가입 하였습니다.',
          });
          await mongoUser.save();
        }
        console.log('몽고유저 생성됨 카카오:',mongoUser)
        const refreshPayload = {
          email: mongoUser.email,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 1), // Refresh token valid for 1 days
        };
        const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
        return res.redirect(`${process.env.ORIGIN}/`);
      } catch (error) {
        return res.redirect(`${process.env.ORIGIN}/Login`);
      }
    })(req, res, next);
  });

  app.get('/user/naver', passport.authenticate('naver', { authType: 'reprompt' }));

  app.get('/user/naver/callback', function(req, res, next) {
    passport.authenticate('naver', async function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect(`${process.env.ORIGIN}/Login`);
      }
      try {
        console.log('몽고유저 조회함 네이버:',user)
        let mongoUser = await User.findOne({ email: user.email });
        if (!mongoUser) {
          mongoUser = new User({
            email: user.email,
            nickName:user.nickname,
            password:user.email,
            method:'naver',
            profileUrl:user.profileImage,
            profileContent:'네이버로 회원가입 하였습니다.',
          });
          await mongoUser.save();
        }
        console.log('몽고유저 생성됨 네이버:',mongoUser)
        const refreshPayload = {
          email: mongoUser.email,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 1), // Refresh token valid for 1 days
        };
        const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
        return res.redirect(`${process.env.ORIGIN}/`);
      } catch (error) {
        return res.redirect(`${process.env.ORIGIN}/Login`);
      }
    })(req, res, next);
  });
  // google login 화면
  app.get(
    "/user/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );

  app.get('/user/google/callback', function(req, res, next) {
    passport.authenticate('google', async function(err, user, info) {
      if (err) {
        return next(err);
      }
      // if (!user) {
      //   return res.redirect(`${process.env.ORIGIN}/Login`);
      // }
      try {
        console.log('몽고유저 조회함 구글:',user)
        let mongoUser = await User.findOne({ email: user.email });
        if (!mongoUser) {
          mongoUser = new User({
            email: user.email,
            nickName:user.displayName,
            password:user.email,
            method:'google',
            profileUrl:user.picture,
            profileContent:'구글로 회원가입 하였습니다.',
          });
          await mongoUser.save();
        }
        const refreshPayload = {
          email: mongoUser.email,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 1), // Refresh token valid for 1 days
        };
        const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
        return res.redirect(`${process.env.ORIGIN}/`);
      } catch (error) {
        return res.redirect(`${process.env.ORIGIN}/Login`);
      }
    })(req, res, next);
  });

  app.get('/api/user', auth, async (req, res) => {
    const user = await User.find({});
    res.json(user);
  });

  app.get('/api/user/token', auth, async (req, res) => { // auth 미들웨어 적용
    try {
      const user = await User.findOne({ email: req.user.email });
      console.log('액세스토큰',req.user.email)
      if (!user) res.status(404).send("No user found");
      const userResponse = user.toObject();
      delete userResponse.password;
      console.log(userResponse)
      return res.status(200).json({email:userResponse.email, nickname:userResponse.nickname});
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/refreshToken',refreshauth, async (req, res) => { // auth 미들웨어 적용
    try {
      console.log('리프레시토큰',req.user.email)
      const payload = {
        email: req.user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 30), //토큰 유효기간 30분
      };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
      res.cookie('accessToken', 'Bearer ' + accessToken, { httpOnly: true, sameSite: 'None', secure: true });
      return res.status(200);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/api/user/:email', auth, async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.email });
      if (!user) res.status(404).send("No user found");
      const userResponse = user.toObject();
      delete userResponse.password;
      res.send(userResponse);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/api/user/signup', async (req, res,next) => {
    try {
      const exUser = await User.findOne({email: req.body.email});
      if (exUser) {
        return res.status(403).send("이미 사용중인 아이디입니다");
      }
      console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    const user = new User({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
      marketing: req.body.marketing,
      method:'direct',
    })
    const savedUser = await user.save();
    res.json(savedUser);
  } catch(error){
    console.error(error);
    next(error)
  }
  });

  app.post("/api/user/signin", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.reason);
      }
      return req.login(user, async (loginErr) => {
        if (loginErr) {
          console.log(err);
          return next(loginErr);
        }
        const payload = {
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + (60 * 30), //토큰 유효기간 30분
        };
        const refreshPayload = {
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 1), // Refresh token valid for 1 days
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
        const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET);
        res.cookie('refreshToken', 'Bearer ' + refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
        res.cookie('accessToken', 'Bearer ' + accessToken, { httpOnly: true, sameSite: 'None', secure: true });
        const userResponse = user.toObject();
        delete userResponse.password;
        return res.status(200).json({ email:userResponse.email,nickname:userResponse.nickname });
      });
    })(req, res, next);
  });

  app.get('/api/pwd/forgot/:email', async (req, res) => {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        "timestamp": new Date(),
        "status": 401,
        "error": "auth_005",
        "message": "User not found"
      });
    }

    console.log(process.env.SEND_EMAIL_ID,process.env.SEND_EMAIL_PW)
    const transporter = nodemailer.createTransport({
      service: "Naver",
      auth: {
        user: process.env.SEND_EMAIL_ID,
        pass: process.env.SEND_EMAIL_PW,
      },
    });
    const payload = {
      email,
      exp: Math.floor(Date.now() / 1000) + (60 * 30), //토큰 유효기간 30분
    };
    const resignToken = jwt.sign(payload, process.env.JWT_SECRET);

    const myUrl = `${process.env.ORIGIN}/newPassword/`;
    const safeToken = encodeURIComponent(resignToken);
    const finalUrl = `${myUrl}?token=${safeToken}`;

    const mailOptions = {
      from: process.env.SEND_EMAIL_ID,
      to: email,
      subject: "Reset Password Link",
      text: "비밀번호 재설정 링크:" + finalUrl,
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Email has been sent' });
      }
    });
  });

  app.post('/api/pwd/newPassword/:secretemail', async (req, res) => {
    const { secretemail } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(secretemail, process.env.JWT_SECRET);
    console.log(secretemail,password,decoded.email)

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({
        "timestamp": new Date(),
        "status": 404,
        "error": "auth_006",
        "message": "Wrong email or password format",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: 'Password has been changed' });
  });

  app.post("/api/user/logout", (req, res, next) => {
    req.logout(() => {
      req.session.destroy();
      res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true, sameSite: 'None', secure: true });
      res.cookie('accessToken', '', { expires: new Date(0), httpOnly: true, sameSite: 'None', secure: true });
      res.send("ok");
    });
  });

  app.get('/api/user/read/:userEmail', async (req, res) => {
    try {
      const userEmail = req.params.userEmail;
      const readArticles = await UserReadArticle.find({user_id: userEmail});
      res.json(readArticles);
    } catch (err) {
      res.json({ message: err });
    }
  });

  app.get('/api/user/like/:userEmail', async (req, res) => {
    try {
      const userEmail = req.params.userEmail;
      const likedArticles = await Like.find({user_id: userEmail});
      res.json(likedArticles);
    } catch (err) {
      res.json({ message: err });
    }
  });

  app.patch('/api/user/:email/nickName', auth, async (req, res) => {
    try {
      let user = await User.findOne({ email: req.params.email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.nickName = req.body.nickName;
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete('/api/user/:email', auth, async (req, res) => {
    try {
      let user = await User.findOneAndDelete({ email: req.params.email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User successfully deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

}
