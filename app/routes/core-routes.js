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

mongoose.connect('mongodb://localhost:27017/reddit');

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index.ejs', {reactOutput: ''});
    });

    app.get('/reddit/', function (req, res) {
        var RedditSub = models('RedditSub');

        RedditSub.find({subreddit: 'gamedeals'}, {name:1, link:1, _id:0, subreddit:1}, function (err, docs) {
            if (err)
                console.log('error occured in the database');
            if (docs.length == 0) {
                console.log('empty db');
                reddit('/r/gamedeals/hot').get({
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
                                subreddit: 'gamedeals',
                                name: link.data.title,
                                link: link.data.url
                            });

                            redditSub.save(function (err) {
                                console.log('game data saved');
                            });
                        });

                        res.json(data);
                    });
            }
            else {
                res.json(docs);
            }
        });


    });

};