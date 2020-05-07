var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var User = require('./models/users');
var flash = require('express-flash');
const crypto = require("crypto");
const passport = require('passport');

const initializePassport = require('./passport-config');

initializePassport(passport);
/*
MongoClient.connect(MONGO_URL, (err, db) => {  
  if (err) {
    return console.log(err);
  }
  else{
  	console.log('Connected to DB');
  }

});*/

//connection to db
mongoose.connect(config.database, { useNewUrlParser: true , useUnifiedTopology: true });

var db= mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){

console.log('connected to mongo DB');

});



var app = express();

app.set("views", path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//Set public folder
app.use(express.static(path.join(__dirname,'public')));



// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
//parse application/json
app.use(bodyParser.json());


//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(flash());



const checkAuthenticated = (req, res,next)=>{

if(req.isAuthenticated()){
  console.log('in authen');
  return next()
}
else{
  console.log('in authen else');
  res.redirect('/login');
}
}

const checkNotAuthenticated = (req, res,next)=>{

if(req.isAuthenticated()){

  console.log('in if not')
  res.render('index',{
    data: req.user.name
  });
}
else{
  console.log('in else not')
next()}
}



const test = [1,2,3,4,5];

app.get('/',(req,res)=>{

console.log(req.user);

if(req.user == undefined){


res.render('index',{
data : ''
});

}
else{
res.render('index',{
data : req.user.firstname
});
}


});

app.get('/login',checkNotAuthenticated,(req,res)=>{

res.render('login');
});

app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
failureRedirect : '/login',
failureFlash: true

}), (req,res)=>{

res.render('index',{
  data: req.user.firstname
});

}

/*var email = req.body.email;
var password = req.body.password;
*/
/*crypto.pbkdf2(password,"64",1000,256,'sha256',(error,hash)=>{


var hashedPassword = hash.toString('hex');
if(error) console.log(error)

User.findOne({'email':email},(err,user)=>{

if(err) console.log(err);

if(user){

var pwd = user.password;

if(pwd == hashedPassword){
  res.redirect('/');
}
else{
  req.flash('info','wrong email and password combination!!');
  res.redirect('/login');
}


}
else{

req.flash('info','email does not exist!!');
res.redirect('/login');


}

);



});
*/

);

app.get('/register', checkNotAuthenticated,(req,res)=>{

res.render('register');
});


app.post('/register', checkNotAuthenticated, (req,res)=>{


 var firstname = req.body.firstname;
 var lastname = req.body.lastname;
 var email = req.body.email;
 var mobile= req.body.mobile;
 var address1 = req.body.address1;
 var address2 = req.body.address2;
 var state = req.body.state;
 var district = req.body.district;
 var pincode = req.body.pincode;
 var password = req.body.password;
 var password2 = req.body.password2;


 User.findOne({'email':email},(err,user)=>{

  if(err) console.log(err);

  if(user){
    req.flash('info', 'Email already exists');
    res.redirect('/register');
  }
  else{

        console.log(mobile);
        console.log(mobile.replace(/\D/g,'').length == 10);



        if(password != password2){
          req.flash('info', 'Passwords Do not match!!');
    res.redirect('/register');

        }
        else{

     crypto.pbkdf2(password,"64",1000,256,'sha256',(error,hash)=>{

  if(error)
    console.log(error);
  
      password = hash.toString('hex');
      console.log(hash.toString('hex'));
      console.log(password);

var user = new User({

  firstname: firstname,
  lastname: lastname,
  email: email,
  mobile: mobile,
  address1: address1,
  address2: address2,
  state: state,
  district: district,
  pincode: pincode,
  password: password

});

user.save((err)=>{

if(err){
  console.log(err);
}
else{
  res.redirect('/login');
}

});


});
}
 }});
});

//start the server
app.listen(process.env.PORT || 3000,()=>{

console.log("Website is up on port 3000");

});





/*
db.collection('notes').insertOne(
    {
      title: 'Hello MongoDB',
      text: 'Hopefully this works!'
    },
    function (err, res) {
      if (err) {
        db.close();
        return console.log(err);
      }
      // Success
      db.close();
    }
  );*/