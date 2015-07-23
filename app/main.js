/** @jsx React.DOM */
var React = require('react/addons');
var SearchBox = require('./components/SearchBox');
var request = require('request');
var $ = require('jQuery');


$.get('/reddit/',
    function (data) {
        if(data == "" || data == null)
            data = [];

        //console.log(data);

        React.render(
            <SearchBox data={data}/>, document.getElementById('search')
        );
    });

//request('http://reddit-search.herokuapp.com/reddit/', function (error, response, data) {
//    if(data != "" && data != null)
//        data = JSON.parse(data);
//    else
//        data = [];
//    React.render(
//        <SearchBox data={data}/>, document.getElementById('search')
//    );
//});





