'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

var mongo = require('mongodb');

function getBookIdFromParam(request) {
	var o_id;
	try {
		o_id = new mongo.ObjectID(request.params.id);
	} catch (e) {
		o_id = request.params.id;
	}
	return o_id;
}

exports.register = function (server, options, next) {
	const db = server.app.db;

	server.route({
		method: 'GET',
		path: '/',
		handler: (request, reply) => {
			reply('This is the root page');
		}
	});

	server.route({
		method: 'GET',
		path: '/test',
		handler: (request, reply) => {
			reply('test test test');
		}
	});

	server.route({
		method: 'GET',
		path: '/books',
		handler: function (request, reply) {

			db.books.find(function (err, docs) {

				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				reply(docs);
			});

		}
	});

	server.route({
		method: 'GET',
		path: '/books/{id}',
		handler: function (request, reply) {

			console.log(request.params.id);

			var o_id = getBookIdFromParam(request);

			db.books.findOne({
				_id: o_id
			}, function (err, doc) {

				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				if (!doc) {
					return reply(Boom.notFound());
				}

				reply(doc);
			});

		}
	});

	server.route({
		method: 'POST',
		path: '/books',
		handler: function (request, reply) {
			// Obtain the json object submitted by the client via request.payload
			const book = request.payload;

			// Create an Id
			book._id = uuid.v1();

			db.books.save(book, function (err, result) {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				reply(book);
			});
		},
		config: {
			validate: {
				payload: {
					title: Joi.string().min(10).max(50).required(),
					author: Joi.string().min(10).max(50).required(),
					isbn: Joi.number()
				}
			}
		}
	});

	server.route({
		method: 'PATCH',
		path: '/books/{id}',
		handler: function (request, reply) {

			db.books.update({
				_id: request.params.id
			}, {
				$set: request.payload
			}, function (err, result) {

				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				if (result.n === 0) {
					return reply(Boom.notFound());
				}

				reply().code(204);
			});
		},
		config: {
			validate: {
				payload: Joi.object({
					title: Joi.string().min(10).max(50).optional(),
					author: Joi.string().min(10).max(50).optional(),
					isbn: Joi.number().optional()
				}).required().min(1)
			}
		}
	});

	server.route({
		method: 'DELETE',
		path: '/books/{id}',
		handler: function (request, reply) {

			var o_id = getBookIdFromParam(request);

			db.books.remove({
				_id: o_id
			}, function (err, result) {

				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error.'));
				}

				if (result.n === 0) {
					return reply(Boom.notFound());
				}

				reply().code(204);
			});
		}
	});

	return next();
};

exports.register.attributes = {
	name: 'routes-books'
};

