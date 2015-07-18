'use strict';

var _ = require('underscore');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var yelp = require("yelp").createClient({
  consumer_key: "E-Q0xyoYv-4_7B9oVw_e_w", 
  consumer_secret: "3wKoRWHp6b4Xc3-ppmFVx75yFIU",
  token: "tPvdCqw12lpbMVcx9xV6uhFFnavaeXiN",
  token_secret: "kgpIbJJ5Ch_7vtaq6svV1Hu8OYg"
});

function getRestaurants(lat, lng, term, cb) {
    var searchString = lat+","+lng;
    var distance = 50000; //distance in meters
    yelp.search({term: term, ll:searchString, radius_filter: distance},function (err, data) {
        var fns = [];
        if (!data || !data.businesses) {
            cb(new Error('Wrong Lat and Long in getRestaurants'), null);
            return;
        }
        _.each(data.businesses, function (elem) {
            fns.push(function (done) {
                getRestaurantPrice(elem.url, function (err, price) {
                    elem.price = price;
                    done();
                });
            });
        });
        async.parallel(fns, function (err) {
            cb(err, data.businesses);
        });
    });
}

function getAmount(numDollarSign) {
    if (numDollarSign === 1) {
        return 8;
    } else if (numDollarSign === 2) {
        return 20;
    } else if (numDollarSign === 3) {
        return 45;
    } else {
        return 60;
    }
}

function getRestaurantPrice(url, cb) {
    var filterClass = 'span.business-attribute.price-range';
    request(url, function (err, resp, body) {
        var $ = cheerio.load(body);
        var dollarSign = $(filterClass).html().length;
        var price = getAmount(dollarSign);
        cb(err, price);
    });
}

function getRec(lat, lng, term, cb) {
    getRestaurants(lat, lng, term, function (err, data) {
        if (!data.length) {
            cb(new Error('Wrong lat and long in getRec'), null);
            return;
        }
        var sorted = _.sortBy(data, function (elem) {
            return elem.rating;
        });
        cb(null, sorted[sorted.length - 1]);
    });
}

function getJourney(lat, lng, cb) {
    var journey = [];
    getRec(lat, lng, 'food', function (err, rest) {
        journey.push(rest);
        var coord = rest.location.coordinate;
        getRec(coord.latitude, coord.longitude, 'dessert', function (err, dsrt) {
            journey.push(dsrt);
            var coord_d = dsrt.location.coordinate;
            getRec(coord_d.latitude, coord_d.longitude, 'bar', function (err, bar) {
                journey.push(bar);
                cb(err, journey);
            });
        });
    });
}

module.exports = {
    getRestaurants: getRestaurants,
    getJourney: getJourney
};
