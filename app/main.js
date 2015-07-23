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