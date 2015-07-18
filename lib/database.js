'use strict';
var mongoose = require('mongoose');


var db = function () {
    return {
        configure: function () {
        	var connectionString = 'mongodb://localhost:27017/NightOwl';

        	console.log(connectionString);

            mongoose.connect(connectionString);
        	var db = mongoose.connection;
        	db.on('error', console.error.bind(console, 'connection error:'));
        	db.once('open', function callback() {
        	    console.log('db connection open');
        	});

        }
    };
};

module.exports = db();