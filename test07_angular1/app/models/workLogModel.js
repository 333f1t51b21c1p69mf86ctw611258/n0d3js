// mongoose for mongodb
var mongoose = require('mongoose');

module.exports = mongoose.model('WorkLog', {
	user : String,
	page : String,
	time : { type : Date, default: Date.now }
});