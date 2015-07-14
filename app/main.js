/** @jsx React.DOM */

var React = require('react/addons');
var SearchBox = require('./components/SearchBox');
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

var testData = [];


reddit('/r/gamedeals/hot').get({
        limit: 75
    }
).then(function (body) {
        var children = body.data.children;
        console.log(children.length);
        children.forEach(function (link, index) {
            testData.push({
                name: link.data.title,
                link: link.data.url
            });
        });

        React.render(
            <SearchBox data={testData}/>,
            document.getElementById('search')
        );
    });


