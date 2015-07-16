/** @jsx React.DOM */
var React = require('react/addons');
var SearchBox = require('./components/SearchBox');
var request = require('request');

request('http://localhost:4444/reddit/', function (error, response, data) {
    console.log(data);
    data = JSON.parse(data);
    React.render(
        <SearchBox data={data}/>,
        document.getElementById('search')
    );
});





