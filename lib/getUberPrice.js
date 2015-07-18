'use strict';

var request = require('request');

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function getPrice(start, end, cb) {
    var rawUrl = 'https://api.uber.com/v1/estimates/price?start_latitude={0}&start_longitude={1}&end_latitude={2}&end_longitude={3}&server_token=o_Gkuo-_Skj3jCq4nLPfRRDw6NwRLZ5oQcznZTil';
    var url = rawUrl.format(start.lat, start.lng, end.lat, end.lng);
    request(url, function(err, resp, body) {
        cb(err, body);
    });
}

module.exports = getPrice;
