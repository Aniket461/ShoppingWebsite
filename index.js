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
var Product = require('./models/product');
var Category = require('./models/category');
var multer = require('multer');
//initializing passport 
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

var Storage = multer.diskStorage({
  destination: './public/uploads/',
  filename :(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage: Storage
}).array('pic',4);

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
  res.redirect('/');
}
else{
  console.log('in else not')
next()}
}



const test = [1,2,3,4,5];

app.get('/',(req,res)=>{


var products = '';

  Product.find({},(err,products)=>{

    var cat = [];

Category.find({},(err,category)=>{

cat = category
console.log(cat);


if(req.user == undefined){
res.render('index',{
data : '',
user : '',
category: category,
products: products,
cartcount: 0
});
}

else{

if(req.session.cart == undefined){
res.render('index',{
data : req.user.firstname,
user : req.user.firstname,
products: products,
category: category,
cartcount: 0
});
}
else{
  res.render('index',{
data : req.user.firstname,
user : req.user.firstname,
products: products,
category: category,
cartcount: req.session.cart.length
});
}


}



  });



  });

/*console.log(products);

console.log(req.user);
*/

});

app.get('/login',checkNotAuthenticated,(req,res)=>{

res.render('login');
});

app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
failureRedirect : '/login',
failureFlash: true

}), (req,res)=>{

res.redirect('/');
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

app.get('/add-cart/:id',(req,res)=>{

var newItem = true;

var id = req.params.id;
console.log(id);
Product.findOne({_id:id},(err,product)=>{
//console.log(product);
console.log(req.session.cart + "cart");
if( req.session.cart == undefined){
   req.session.cart = [];

  req.session.cart.push({

    id: product._id,
    qty:1,
    price: parseFloat(product.price).toFixed(2),
    image: product.image1
  });

  console.log(req.session.cart);

}
else{

  var cart = req.session.cart;

for(var i= 0; i<cart.length;i++){
  if(cart[i].id == product._id){

    cart[i].qty++;
    newItem = false;
    break;

  }
}

if(newItem){

  cart.push({

    id: product._id,
    qty:1,
    price: parseFloat(product.price).toFixed(2),
    image: product.image1
  }); 
}
  
}
  
console.log(req.session.cart);
req.flash('info','Product added success successfully!!');
  res.redirect('/cart');


});

console.log(req.session.cart);

});

app.get('/register', checkNotAuthenticated,(req,res)=>{

res.render('register');
});


app.post('/add-product',upload,(req,res)=>{


console.log(req.files[0]);


var product = new Product({

title: req.body.title,
description: req.body.description,
category: req.body.category,
image1: req.files[0].filename,
image2: req.files[1].filename,
image3: req.files[2].filename,
image4: req.files[3].filename,
price: req.body.price,
});

product.save((err)=>{
  if(err) console.log(err);
  else{
    req.flash('info','Product added successfully');
    res.redirect('/add-product');
  }
})

});


app.get('/cart/update/:id',(req,res)=>{


var id = req.params.id;

   var cart = req.session.cart;
   var action = req.query.action;
   console.log("cart is here "+ cart);
   var action = req.query.action;
   console.log(action)

   for( var i=0; i<cart.length ; i++){
    if(cart[i].id == id) {

      switch(action){

        case "add":
          cart[i].qty++;
          break;
        case "remove":
          cart[i].qty--;
          if(cart[i].qty <1) cart.splice(i, 1); 
          if(cart.length == 0) delete req.session.cart;
          break;
        case "clear":
          cart.splice(i, 1);
          if(cart.length == 0) delete req.session.cart;
          break;
        default:
          console.log('update problem');
          break;

      }
      break;
    }
   }
   req.flash('info', 'Cart Updated!');
  res.redirect('/cart');


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


app.get('/dashboard',checkAuthenticated, (req,res)=>{

var e = req.user.email;
var test = 'surveaniket461@gmail.com';
console.log(e == test);
console.log(e);

  if(e == "surveaniket461@gmail.com"){
console.log("in checkadmin");
res.render('dashboard',{

data: 'Welcome to dashboard',
user: req.user.firstname


})
}
else{
  req.flash('info','You should have admin access');
  res.redirect('/');
}

});


app.get('/add-product', checkAuthenticated, (req,res)=>{

var e = req.user.email;
var test = 'surveaniket461@gmail.com';
console.log(e == test);
console.log(e);

  if(e == "surveaniket461@gmail.com"){

    Category.find({},(err,cat)=>{

      res.render('addproduct',{
        category: cat
      });

    });

  
}
else{
  res.redirect('/');
}


});



app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});





app.get('/cart',checkAuthenticated,(req,res)=>{

if(req.session.cart == undefined){
  req.flash('info', 'Your cart is empty');
  res.render('cart',{
    all: '',
    user: req.user.firstname
  })
}
else{
  console.log(req.session.cart[0]);
res.render('cart',{
  all: req.session.cart,
  user: req.user.firstname
});
}
});


app.get('/add-category',checkAuthenticated,(req,res)=>{
var e = req.user.email;
var test = 'surveaniket461@gmail.com';
console.log(e == test);
console.log(e);

  if(e == "surveaniket461@gmail.com"){
  res.render('addcategory');
}
else{

  res.redirect('/');
}

})

app.post('/add-category',(req,res)=>{

var category = req.body.category;

Category.findOne({category: category},(err,cat)=>{
  if(cat){
    req.flash('info','Category Already Exists!!');
    res.redirect('/add-category');
  }

  else{
    var categ = new Category({

        category: category

    })
    categ.save((err)=>{
      if(err){
        req.flash('info','Failed to add category!!');
        res.redirect('/add-category');
      }
      else{

        req.flash('info','Category Added!!');
        res.redirect('/add-category');
      }
    })

}
});

});

app.get('/userprofile',checkAuthenticated,(req,res)=>{

console.log(req.user)
User.findOne({email:req.user.email},(err,us)=>{

  console.log(us);

res.render('userprofile',{
  user: req.user.firstname,
  complete: us
});


})

});

app.post('/userprofile',checkAuthenticated,(req,res)=>{


var ObjectId = require('mongodb').ObjectId;
id = new ObjectId(req.user._id);


console.log(req.user +"hereeee");
console.log(req.body);


User.findOne({_id:id},(err,user)=>{
  console.log(user);
})


User.updateOne(
  {_id: req.user._id},
  {
  $set:
  {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    mobile: req.body.mobile,
    address1: req.body.address1,
    address2: req.body.address2,
    state: req.body.state,
    district: req.body.district,
    pincode: req.body.pincode
  }
}
).exec();


req.logout();
req.flash('info','Profile Updated Successfully, Please Login!')
res.redirect('/login');

});





app.get('/:id',(req,res)=>{

var id = req.params.id;

Product.findOne({_id:id},(err,product)=>{

if(req.user == undefined){
 
res.render('oneproduct',{

    product: product,
    user: '',
    cartcount: 0
});
}

else{

  if(req.session.cart == undefined){

res.render('oneproduct',{

    product: product,
    user: req.user.firstname,
    cartcount:0
});    
  }
  else{
    res.render('oneproduct',{

    product: product,
    user: req.user.firstname,
    cartcount: req.session.cart.length
});
  }
 
}

});

})


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