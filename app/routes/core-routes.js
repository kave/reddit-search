var EventEmitter = require('events').EventEmitter;
var emitter      = new EventEmitter();

var mongoose = require("mongoose");
var models = require('../models');

var React = require('react/addons');

var Snoocore = require('snoocore');
var reddit = new Snoocore({
    userAgent: 'reddit-elastic-search-debug',
    oauth: {
        type: 'explicit',
        key: 'rffsox3_05QgRw',
        secret: 'fNEULM0mltK2CKk1sWXU_BrEbmE',
        redirectUri: 'http://localhost:4444/',
        scope: ['read']
    }
});

var crawlLinks = ['gamedeals', 'games', 'gaming', 'pcmasterrace'];

mongoose.connect('mongodb://localhost:27017/reddit');

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index.ejs', {reactOutput: ''});
    });

    app.get('/reddit/', function (req, res) {
        var RedditSub = models('RedditSub');
        var responseData = [];
        var currentPoint = 0;

        crawlLinks.forEach(function(subName){

            RedditSub.find({subreddit: subName}, {name:1, link:1, _id:0, subreddit:1}, function (err, docs) {
                if (err)
                    console.log('error occured in the database');
                if (docs.length == 0) {
                    console.log('empty db');
                    reddit('/r/' + subName +'/hot').get({
                            limit: 75
                        }
                    ).then(function (body) {
                            var children = body.data.children;
                            var data = [];
                            children.forEach(function (link, index) {
                                data.push({
                                    name: link.data.title,
                                    link: link.data.url
                                });
                                redditSub = new RedditSub({
                                    subreddit: subName,
                                    name: link.data.title,
                                    link: link.data.url
                                });

                                redditSub.save(function (err) {});
                            });

                            responseData = responseData.concat(data);
                            currentPoint++;
                            if (currentPoint < crawlLinks.length) {
                                return emitter.once('done', function() {
                                    console.log('game data saved');
                                    res.json(responseData);
                                });
                            }

                            if (currentPoint === crawlLinks.length) {
                                emitter.emit('done');
                            }
                        });
                }
                else {
                    responseData = responseData.concat(docs);
                    currentPoint++;

                    if (currentPoint < crawlLinks.length) {
                        return emitter.once('done', function() {
                            console.log('gotten from db');
                            res.json(responseData);
                        });
                    }

                    if (currentPoint === crawlLinks.length) {
                        emitter.emit('done');
                    }
                }


            });
        });
    });

};