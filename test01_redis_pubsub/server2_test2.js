var redis = require('./server2');
var assert = require('assert');

var testsMissing = 0;

var hub = redis({
	url: 'redis://localhost:6379/'
});

var expectCall = function (f) {
	testsMissing++;

	console.log("expectCall testsMissing: " + testsMissing);

	var count = 1;
	return function () {
		testsMissing--;

		console.log("expectCall child testsMissing: " + testsMissing);

		assert(count-- >= 0);
		f.apply(null, arguments);
	};
};

hub.on('testSimple', expectCall(function (channel, msg) {
	console.log("on testSimple: channel = testSimple >>> " + (channel == 'testSimple') + " >>> msg = ok >>> " + (msg === 'ok'));

	assert(channel == 'testSimple');
	assert(msg === 'ok');
}));

hub.flush(function () {
	hub.emit('testSimple', 'ok');
});

setTimeout(function () {
	console.log("setTimeout hub: " + testsMissing);

	assert(!testsMissing);
	hub.close();
}, 20000);

setTimeout(function () {
	console.log("setTimeout process: " + testsMissing);

	// Check to see if .close() works
	process.exit(1);
}, 50000).unref();