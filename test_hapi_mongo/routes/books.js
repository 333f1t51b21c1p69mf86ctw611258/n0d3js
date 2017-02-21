'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

var mongo = require('mongodb');

exports.register = function (server, options, next) {
    const db = server.app.db;

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

            var o_id = new mongo.ObjectID(request.params.id);

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

    return next();
};

exports.register.attributes = {
    name: 'routes-books'
};

