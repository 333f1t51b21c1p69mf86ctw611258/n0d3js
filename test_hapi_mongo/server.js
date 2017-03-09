'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
	port: 3000
});

// Connect to Database
server.app.db = mongojs('test', ['books', 'library']);

// Load plugins and start server
server.register([
	require('./routes/books')
], function (err) {

	if (err) {
		throw err;
	}

	// Start the server
	server.start(function (err) {
		if (err) {
			// Fancy error handling here
			console.error('Error was handled!');
			console.error(err);
		}

		console.log('Server running at: %s %d', server.info.uri, 12345);
	});

});