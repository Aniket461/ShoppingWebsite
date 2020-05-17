var mongoose = require('mongoose');

var ProductSchema = mongoose.Schema({

title:{
	type: String,
	required: true
},

description:{
	type: String,
	required: true
},
category:{
	type: String,
	required: true
},
image1:{
	type: String,
	required: true
},
image2:{
	type: String,
	required: true
},
image3:{
	type: String,
	required: true
},
image4:{
	type: String,
	required: true
},
price:{
	type: Number,
	required: true
},



});


var Product = module.exports = mongoose.model('Product', ProductSchema);