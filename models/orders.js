var mongoose = require('mongoose');

var OrderSchema = mongoose.Schema({

userId:{
	type: String,
	required: true
},

productId:{
	type: String,
	required: true
},
image:{
	type: String,
	required: true
},
price:{
	type: String,
	required: true
},
quantity:{
	type: String,
	required: true
},
placedDate:{
	type: String,
	required: true
},
deliveryDate:{
	type: String,
	required:true
}


});


var Order = module.exports = mongoose.model('Order', OrderSchema);