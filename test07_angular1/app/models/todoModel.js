// mongoose for mongodb
var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
	text : String,
	description : { type : String, default: 'abc' },
	done : Boolean
});