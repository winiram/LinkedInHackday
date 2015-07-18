'use strict';
var getUberPrice = require('../lib/getUberPrice');
var Yelp = require('../lib/getYelpData');
var IndexModel = require('../models/index');
var bcrypt = require('bcrypt');

var qs = require('querystring');

module.exports = function (router) {

    var Journey = new IndexModel();

    router.get('/', function (req, res) {
        res.send('ok');
    });
    router.get('/uberprice/:startLat/:startLng/:endLat/:endLng', function (req, res) {
        var start = {
            lat: req.params.startLat,
            lng: req.params.startLng
        };
        var end = {
            lat: req.params.endLat,
            lng: req.params.startLng
        };
        getUberPrice(start, end, function (err, pricing) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(pricing);
            }
        });
    });

    router.get('/nearby/:lat/:lng', function (req, res) {
        Yelp.getRestaurants(req.params.lat, req.params.lng, 'food', function (err, data) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    });

    router.get('/getJourney/:lat/:lng', function (req, res) {
        Yelp.getJourney(req.params.lat, req.params.lng, function (err, data) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            if (err) {
                res.json(err);
            } else {
                res.json(data);
            }
        });
    });


    // router.option('/saveData', function(req, res) {
    //      res.header("Access-Control-Allow-Origin", "*");
    //      res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //      res.json();
    // });

    router.post('/saveData', function (req, res) {
        
        console.log(req.body);
        var data = req.body;  
        Journey.create({
                data : data
          }, function(err, doc){
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
                if(err){
                console.log("Error in data saving"+err);
                res.sendStatus(400);
            }
            else{
                console.log("document created sucfessfully"+doc);
                res.sendStatus(200);
            }
        });
                   
    });

    router.get('/getAllData', function(req, res){
      Journey.find({}, function (err, docs) {
        if(!err){
            var data = [];

            for (var i = docs.length - 1; i >= 0; i--) {
                var result = docs[i];
                var journey ={
                    "id": result._id,
                    "data": result.data
                };
                data.push(journey);
            };
            
            res.json(data); 
        }else{
            res.sendStatus(400);
        }
        
      });
    });

    router.get('/getData/:id', function(req, res){
      Journey.findOne({_id: req.params.id}, function (err, doc) {
        if(!err){
            res.json(doc); 
        }else{
            res.sendStatus(400);
        }
        
      });
    });
};
