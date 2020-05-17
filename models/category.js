var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({

	category:{
		type: String,
		required: true
	}
});


var Category = module.exports = mongoose.model('Category', CategorySchema);