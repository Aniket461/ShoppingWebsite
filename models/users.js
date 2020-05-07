var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({


firstname:{
	type: String,
	required: true
},
lastname:{
	type: String,
	required: true
},
email:{
	type: String,
	required: true
},
mobile: {
	type: Number,
	required: true

},
address1:{
	type: String,
	required: true
},
address2:{
	type: String,
	required: true
},
state:{
	type: String,
	required: true
},
district:{
	type: String,
	required: true
},
pincode:{
	type: Number,
	required: true
},
password: {
	type: String,
	required: true
}

});


var User = module.exports = mongoose.model('User', UserSchema);