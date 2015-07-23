/** @jsx React.DOM */
var React = require('react/addons');
var SearchBox = require('./components/SearchBox');
var request = require('request');

request('/reddit/', function (error, response, data) {
    //console.log(data);
    if(data != "" && data != null)
        data = JSON.parse(data);
    else
        data = [];
    React.render(
        <SearchBox data={data}/>, document.getElementById('search')
    );
});





