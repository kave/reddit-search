var mongoose = require("mongoose");
var mongoosastic = require("mongoosastic");
var models = require('../models');

var React = require('react/addons');
//SearchBox = React.createFactory(require('../components/SearchBox'));

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
        // React.renderToString takes your component
        // and generates the markup

        //var reactHtml = React.renderToString(SearchBox({data: testData}));
        //res.render('index.ejs', {reactOutput: reactHtml});
        res.render('index.ejs', {reactOutput: ''});
    });

    app.get('/reddit/', function (req, res) {
        var RedditSub = models('RedditSub');

        RedditSub.findOne({subreddit: 'gamedeals'}, function (err, docs) {
            if (err)
                console.log('error occured in the database');

            if (docs == null) {
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
                        });

                        redditSub = new RedditSub({
                            subreddit: 'gamedeals',
                            data: data
                        });

                        redditSub.save(function (err) {
                            console.log('data saved'); redditSub.on('es-indexed', function (err) {
                                console.log('data indexed');

                                RedditSub.createMapping(function (err, mapping) {
                                    if (err) {
                                        //console.log('error creating mapping (you can safely ignore this)');
                                        //console.log(err);
                                    } else {
                                        console.log('mapping created!');
                                        console.log(mapping);
                                    }

                                    res.json(data);
                                    //res.redirect("/");
                                });

                            });
                        });
                    });
            }
            else {
                res.json(docs.data);
            }
        });


    });

};