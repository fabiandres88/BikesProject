require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport= require('./config/passport');
const session = require('express-session');
const User = require('./models/users');
const jwt= require ('jsonwebtoken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tokenRouter = require('./routes/token');
var bikesRouter = require('./routes/bikes');
//API Routes
var bikesAPIRouter = require('./routes/api/bikes');
var usersAPIRouter = require('./routes/api/users');
var authAPIRouter = require('./routes/api/auth');

const store =new session.MemoryStore;

var app = express();

app.set('secretKey', 'jwt_pwd_!!223344');

app.use(session({
  cookie: { maxAge: 240 * 60 * 60 * 1000},
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'bike_network:2020'
}));

//Mongoose configuration
var mongoose = require('mongoose');
// mongodb+srv://admin-bikes:<password>@bikes-network.xtybg.mongodb.net/<dbname>?retryWrites=true&w=majority
var mongoDB = process.env.MONGO_URI; 
// var mongoDB = 'mongodb://localhost/bikes_network';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.Promise= global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function () {
  console.log('We are connected to the database');  
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function (req, res){
  res.render('session/login');
});

app.post('/login', function(req,res,next){
  passport.authenticate('local', function (error, user, info){
    if (error) return next(error);
    if (!user) return res.render('session/login', {info});
    req.login(user, function (error){
      if (error) return next(error);
      return res.redirect('/');
    });
  });(req, res , next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/forgotPassword', function(req, res){
  res.redirect('session/forgotPassword');
});


app.post('/forgotPassword', function(req, res){
  User.findOne({email: req.body.email}, function (error, user){
    if (!user) return res.render('session/forgotPasword', {info: {message:'Not'}});

    user.resetPassword(function(error) {
      if (error) return next (error);
      console.log('session/forgotPaswordMessage');      
    });

    res.render('session/forgotPaswrodMessage');
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/token', tokenRouter);
app.use('/bikes',loggedIn, bikesRouter);
//API Routes
app.use('/api/bikes', validateUser, bikesAPIRouter);
app.use('/api/users', usersAPIRouter);
app.use('/api/auth', authAPIRouter);

app.use('/privacy-policy', function (req, res){
  res.sendFile('public/privacy_policy.html');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//middleware to validete user login
function loggedIn(req, res, next){
  if (req.user) {
    next();
  }else{
    console.log('User without login.');
    res.redirect('/login');
  };
};

function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('scretKey'), function (eror, decoded) {
    if (error){
      res.json({status:"error", message: error.message, data:null});
    }else{

      req.body.userId = decoded.id;
      console.log('jwt verify' + decoded);
      next();

    };    
  });
};

module.exports = app;