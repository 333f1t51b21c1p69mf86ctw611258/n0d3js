'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
	port: 3000
});

// Connect to Database
server.app.db = mongojs('test', ['books']);

// Load plugins and start server
server.register([
	require('./routes/books')
], function (err) {

	if (err) {
		throw err;
	}

	// Start the server
	server.start(function(err) {
		console.log('Server running at: ', server.info.uri);
	});

});