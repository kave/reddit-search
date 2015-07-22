// server.js

var express = require('express'),
    path = require('path'),
    app = express(),
    port = 4444,
    bodyParser = require('body-parser');

// Make sure to include the JSX transpiler
require("node-jsx").install();

// Include static assets. Not advised for production
app.use(express.static(path.join(__dirname, 'public')));
// Set view path
app.set('views', path.join(__dirname, 'views'));
// set up ejs for templating. You can use whatever
app.set('view engine', 'ejs');

// Set up Routes for the application
require('./app/routes/core-routes.js')(app);

//Route not found -- Set 404
app.get('*', function (req, res) {
    res.json({
        "route": "Sorry this page does not exist!"
    });
});

var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 60);

var mongoose = require("mongoose");
var models = require('./app/models');
var config = require('./app/config');
var RedditSub = models('RedditSub');
var subreddits = config('redditAPI').subreddits;
var redditAPI = config('redditAPI').api;

schedule.scheduleJob(rule, function () {
    console.log('Updating Database... every 5 mins');
    subreddits.forEach(function (subName) {
        redditAPI('/r/' + subName + '/hot').get({
                limit: 75
            }
        ).then(function (body) {
                var children = body.data.children;
                children.forEach(function (link) {
                    var redditSub;
                    if(link.data.selftext_html != null) {
                        redditSub = new RedditSub({
                            subreddit: subName,
                            name: link.data.title,
                            link: link.data.url,
                            text: link.data.selftext_html.substring(21, link.data.selftext_html.length - 20)
                        });
                    }
                    else{
                        redditSub = new RedditSub({
                            subreddit: subName,
                            name: link.data.title,
                            link: link.data.url,
                            text: ''
                        });
                    }
                    if(redditSub != null) {
                        redditSub.save(function (err) {});
                    }
                });
            });
    });
});

app.listen(port);
console.log('Server is Up and Running at Port : ' + port);