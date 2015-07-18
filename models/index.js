'use strict';

var mongoose = require('mongoose');


module.exports = function IndexModel() {
	var journeySchema = mongoose.Schema({
		data: Object
	}, {
		collection : 'journeyData'
	});

	return mongoose.model('journey', journeySchema);
};