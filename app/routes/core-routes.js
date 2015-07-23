var EventEmitter = require('events').EventEmitter;
var emitter      = new EventEmitter();

var mongoose = require("mongoose");
var models = require('../models');
var config = require('../config');
var React = require('react/addons');
var connectURL = process.env.MONGO_URL || process.env.MONGOLAB_URI;
mongoose.connect(connectURL);

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index.ejs', {reactOutput: ''});
    });

    app.get('/reddit/', function (req, res) {
        var RedditSub = models('RedditSub');
        var subreddits = config('redditAPI').subreddits;
        var responseData = [];
        var currentPoint = 0;

        subreddits.forEach(function(subName){

            RedditSub.find({subreddit: subName}, {name:1, link:1, _id:0, subreddit:1, text:1}, function (err, docs) {
                if (err)
                    console.log('error occured in the database');
                if (docs.length > 0){
                    responseData = responseData.concat(docs);
                }

                if (currentPoint == 0) {
                    emitter.once('done', function() {
                        return res.json(responseData);
                    });
                }


                currentPoint++;


                if (currentPoint === subreddits.length) {
                    emitter.emit('done');
                }
            });
        });
    });

};