const express = require('express');
const ejs = require('ejs');
const path = require("path");
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const sessions = require('express-session');
const oneDay = 1000 * 60 * 60 * 24;
global.appRoot = path.resolve(__dirname);
const dbService = require('./db/db.service');
const DB = dbService().start();
app.use(express.static(path.join(__dirname, '../public')));
const Models = require('./models/index');
const FeedbackModel = Models.clientFeedbacks
const ItemModel = Models.items
app.use((err, req, res, next) => {
 if (err && err.error && err.error.isJoi) {
 const errDetail = [];
 if (err.error.details) {
 err.error.details.map((item) => {
 const temp = {};
 temp[item.context.key] = item.message;
 errDetail.push(temp);
      });
    }
 res.status(400).json({
 Status: false,
 Data: errDetail,
 Message: 'Model InValid',
    });
  } else {
 // pass on to another error handler
 console.log('I am here!');
 res.status(500).json({
 Status: false,
 Data: err,
 Message: 'Error Occured',
    });
  }
});
app.use(sessions({
 secret: "secret",
 saveUninitialized:true,
 cookie: { maxAge: oneDay },
 resave: false
}));
const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());
let feedback = [
  {name:"Ankit Joshi", feedback: "Very coperative and perfect service", image: 'https://lh3.googleusercontent.com/a/AGNmyxZgZARrA6EcEsHtCt3JkGMIYRHjvM83HYDPAiHUpw=s96-c'}
]
let feedback_message
app.set('view engine', 'ejs');
app.set('views', 'views');
app.get('/success', async (req, res) =>{
 await FeedbackModel.create({ name: userProfile.displayName, email: userProfile.emails[0].value, image: userProfile.photos[0].value, feedback: feedback_message });
 feedback_message = null;
 let feedbackResponse = await FeedbackModel.findAll();
 res.render(path.join(__dirname+'/views/about.ejs'), {
 feedback: feedbackResponse && feedbackResponse.length>0 ? feedbackResponse : feedback
  });
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
 cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
 cb(null, obj);
});
app.get('/', (req, res) => {
 res.render(path.join(__dirname+'/views/home.ejs'));
});
app.get('/about', async (req, res) => {
 let feedbackResponse = await FeedbackModel.findAll();
 res.render(path.join(__dirname+'/views/about.ejs'), {
 feedback: feedbackResponse && feedbackResponse.length>0 ? feedbackResponse : feedback
  });
});
app.get('/contact', (req, res) => {
 res.render(path.join(__dirname+'/views/contact.ejs'));
});
app.get('/services', (req, res) => {
 res.render(path.join(__dirname+'/views/services.ejs'));
});
app.get('/login', logout, (req, res) => {
 res.render(path.join(__dirname+'/views/login.ejs'), {
 success: null,
 message:null
  });
});
app.post("/login", async function(req,res){
 console.log(req.body);
 if(req.body.username && req.body.password && req.body.username =='ankitdev' && req.body.password =='justdontit'){
  const options = {
    expiresIn: '1h' // token will expire in 1 hour
  };
 const token = jwt.sign({
 data: {username: req.body.username, permission: 'logined'}
    }, 'secret', options);
 req.session.token = token;
 res.redirect("dashboard/items");
} else {
  res.render(path.join(__dirname+"/views/login"), {
    success: false, message: "Incorrect Credentials"  });
}
});
app.get("/dashboard/items", async function (req, res){
  jwt.verify(req.session.token, 'secret', async function(err, decoded) {
    if(err){
      delete req.session.token;
      res.render(path.join(__dirname+"/views/login"), {
      success: false, message: err.message  });
    } else {
      let itemRes = await ItemModel.findAll();
      res.render(path.join(__dirname+"/views/dashboard"),{ username: decoded.data.username, flip: true, data: itemRes, page: "items" });
    }
  })
})
app.get("/dashboard/feedback", async function (req, res){
  jwt.verify(req.session.token, 'secret', async function(err, decoded) {
    if(err){
      delete req.session.token;
      res.render(path.join(__dirname+"/views/login"), {
      success: false, message: err.message  });
    } else {
      let feedbackRes = await FeedbackModel.findAll();
      res.render(path.join(__dirname+"/views/dashboard"),{ username: decoded.data.username, flip: true, data: feedbackRes, page: "comments" });
    }
  })
})
app.post("/add-item", async function(req,res){
await ItemModel.create(req.body);
res.json({ success: true })
});
app.post("/logout",function(req,res){
 delete req.session.token;
 res.render(path.join(__dirname+"/views/login"), {
 success: true,
 message:"Logout successfully."
  });
});
app.post("/delete-item",function(req,res){
  console.log(req)
});
app.post("/delete-feedback",function(req,res){
  console.log(req)
});
app.listen(4000, () => {
 console.log('Server listening on port 3000');
 return DB;
});
function logout(req, res, next) {
 if (req && req.session && req.session.token){
 jwt.verify(req.session.token, 'secret', async function(err, decoded) {
 if(decoded){
res.redirect("dashboard/items");
      } else {
 delete req.session.token;
 res.render(path.join(__dirname+"/views/login"), {
 success: false, message: err.message 
        });
      }
    });
  } else {
 next()
  }
};
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
 clientID: '268356325427-p6nrol1dp5pqm2np42bf78dtvb8or9uc.apps.googleusercontent.com',
 clientSecret: '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',
 callbackURL: "http://localhost:3000/auth/google/callback"
  },
 function(accessToken, refreshToken, profile, done) {
 userProfile=profile;
 return done(null, userProfile);
  }
));
app.get('/add-client-comment', (req, res) => {
  feedback_message = req.query.comment;
  res.redirect('/auth/google');
 });
app.get('/auth/google', 
 passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
 passport.authenticate('google', { failureRedirect: '/error' }),
 function(req, res) {
 res.redirect('/success');
  });