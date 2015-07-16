/** @jsx React.DOM */

var React = require('react/addons');
var Griddle = React.createFactory(require('griddle-react'));
var models = require('../models');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    //log: 'trace',
    requestTimeout: Infinity, // Tested
    keepAlive: true // Tested
});

function highlighted(link, highlight){
    if('name' in highlight){
        link.name = highlight.name[0];
       // link.name = link.name.replace(/em/g,'strong');
    }
    if('link' in highlight){
        link.link = highlight.link[0];
    }

    return link;
}

var SearchBox = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input search criteria......'
        };
    },
    search: function () {
        var query = this.refs.searchInput.getDOMNode().value; // this is the search text
        this.props.search(query);
    },
    render: function () {
        return (
            <input type="text" ref="searchInput" className="form-control" placeholder={this.state.message} value={this.props.query} onChange={this.search}/>
        );
    }
});

var TableItem = React.createClass({
    render: function () {
        return <tr>
            <td className="blah"><div dangerouslySetInnerHTML={{__html: this.props.data.name}}> siiigh</div></td>
            <td>{this.props.data.link}</td>
        </tr>;
    }
});

var GriddleTableNameItem = React.createClass({
    render: function () {
        return <div dangerouslySetInnerHTML={{__html: this.props.data}}/>;
    }

});

var DisplayTable = React.createClass({
    render: function () {
        var rows = [];
        this.props.data.forEach(function (link, index) {
            rows.push(<TableItem key={index} data={link}/>)
        });
        return (
            <table className="table table-striped table-bordered" cellSpacing="0" width="100%">
                <thead >
                    <tr>
                        <th className="text-center">Name</th>
                        <th className="text-center">Link</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});

var QueryFilter = React.createClass({
    search: function (queryText) {
        console.log(queryText);
        var queryResult = [];
        var state = this;
        client.search({
            index: 'reddit',
            type: 'redditsubs',
            body: {
                query: {
                    match: {
                        name: {
                            fuzziness: 2,
                            query: queryText,
                            prefix_length: 1
                        }
                    }
                },
                highlight: {
                    fields : {
                        name : {},
                        link : {}
                    }
                }
            }
        }).then(function (resp) {
            var hits = resp.hits.hits;
            hits.forEach(function(res){
                queryResult.push(highlighted(res._source, res.highlight));
            });

            state.setState({
                query: queryText,
                filteredData: queryResult
            });
        }, function (err) {
            console.trace(err.message);
        });
    },

    getInitialState: function () {
        return {
            query: '',
            filteredData: this.props.data,
            columns: ["name", "link"],
            columnMetadata: [
                {
                    "columnName": "name",
                    "order": 1,
                    "locked": false,
                    "visible": true,
                    "cssClassName": "text-center",
                    "displayName": "Name",
                    "customComponent": GriddleTableNameItem
                },
                {
                    "columnName": "link",
                    "order": 2,
                    "locked": false,
                    "visible": true,
                    "cssClassName": "text-center",
                    "displayName": "Link",
                    "customComponent": GriddleTableNameItem
                }],
            resultsPerPage: 8
        }
    },

    render: function () {
        return (
            <div className="QueryFilter">
                <div id="table-area">
                    <SearchBox query={this.state.query} search={this.search}/>
                    <br/>
                    <Griddle results={this.state.filteredData}
                        columns={this.state.columns}
                        resultsPerPage={this.state.resultsPerPage}
                        columnMetadata={this.state.columnMetadata}
                        tableClassName="table"/>

                </div>
            </div>
        );
    }
});

module.exports = QueryFilter;