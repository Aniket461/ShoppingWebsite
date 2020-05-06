const LocalStrategy = require('passport-local').Strategy
const crypto = require("crypto");
const User = require('./models/users');


function initialize(passport){

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // console.log(`id: ${id}`);
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(error => {
      console.log(`Error: ${error}`);
    });
});


let us = ''
passport.use(new LocalStrategy({usernameField: 'email'},(email,password, done)=>{

console.log(`${email} and ${password}`);

User.findOne({'email':email},(err,user)=>{

console.log(user);
us = user;

if(err) {return done(err)}
if(!user){ return done(null,false,{message: 'No such username exists!!'})}
/*var hashedPassword = '';*/
crypto.pbkdf2(password,"64",1000,256,'sha256',(error,hash)=>{
		 var hashedPassword = hash.toString('hex');
		console.log(hash.toString('hex'));
	
console.log(`${hashedPassword} is the password`);
if(hashedPassword != user.password){
	return done(null, false,{message: 'Wrong passowrd!!'})
}

return done(null,user);
console.log(`This is user id ${user._id}`);

	});

});
}))


}





/*
function initialize(passport){

	passport.use(new LocalStrategy({usernameField:'email'},
  function(email, password, done) {
    User.findOne({ 'email': email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
passport.serialUser((user,done)=>{})
passport.deserialUser((id,done)=>{})
));
};
*/
/*
let hashedPassword = '';
function authenticateUser( email,password, done){
	

	
	if(user == null){
		return done(null,false, {message: "No User with that email"})
	}

		
		if(hashedPassword == user.password){

			return done(null,user)

		}
		else{

			return done(null, false, {message: 'Password Incorrect!!'})
		}

}

passport.use(new LocalStrategy({ usernameField: 'email'}), authenticateUser)
*/









module.exports = initialize;