/** @jsx React.DOM */

var React = require('react/addons');
var Griddle = require('griddle-react');
var models = require('../models');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    // @if NODE_ENV='prod'
    host: '/* @echo SEARCHBOX_SSL_URL */',
    // @endif
    // @if NODE_ENV='dev'
    host: '/* @echo ELASTICSEARCH_URL */',
    // @endif
    //log: 'trace',
    requestTimeout: Infinity, // Tested
    keepAlive: true // Tested
});

function highlighted(link, highlight) {
    if(highlight != null) {
        if ('name' in highlight) {
            link.name = highlight.name[0];
        }
    }
    //if ('text' in highlight) {
    //    link.text = highlight.text[0];
    //}

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
            <div className="form-inline">
                <input type="text" ref="searchInput" className="form-control" style={{width: 90 + '%'}} placeholder={this.state.message} value={this.props.query} onChange={this.search}/>
                <a className="btn btn-primary" href="/">Clear</a>
            </div>
        );
    }
});

var Modal = require('react-modal-bootstrap');
var ModalClose = require('react-modal-bootstrap/lib/ModalClose');

var $ = require("jQuery");
var GriddleTableNameItem = React.createClass({

    getInitialState: function () {
        return {isOpen: false};
    },
    openModal: function () {
        this.setState({isOpen: true});
    },
    hideModal: function () {
        this.setState({isOpen: false});
    },
    render: function () {
        var text = $.parseHTML(this.props.rowData.text);
        if(text != null) {
            text = text[0].textContent;
            return (
                <div>
                    <a onClick={this.openModal} dangerouslySetInnerHTML={{__html: this.props.data}}/>
                    <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal} >
                        <div className='modal-header'>
                            <ModalClose onClick={this.hideModal}/>
                            <h4 className='modal-title'>Link Description</h4>
                        </div>
                        <div className='modal-body'>
                            <div dangerouslySetInnerHTML={{__html: text}}/>
                        </div>
                    </Modal>
                </div>
            );
        }
        else {
            return (
                    <div dangerouslySetInnerHTML={{__html: this.props.data}}/>
            );
        }


    }
});


var GriddleTableLinkItem = React.createClass({
    render: function () {
        return <a href={this.props.data} target="_blank">{this.props.data}</a>;
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
        var querySearchOptions = {
            index: 'reddit',
            type: 'redditsubs',
            body: {
                query: {
                    multi_match: {
                        query: queryText,
                        fields: [
                            "name",
                            "text"
                        ],
                        fuzziness: "2",
                        prefix_length: 1
                    }
                },
                highlight: {
                    fields: {
                        name: {},
                        text: {"force_source" : true, "number_of_fragments" : 0}
                    }
                }
            }
        }

        var returnAllOptions = {
            index: 'reddit',
            type: 'redditsubs',
            body: {
                query: {
                    match_all: {}
                }
            }
        };

        var options;
        if(queryText != null && queryText != '')
            options = querySearchOptions;
        else
            options = returnAllOptions;

        var state = this;
        client.search(options).then(function (resp) {
            var queryResult = [];
            var hits = resp.hits.hits;
            hits.forEach(function (res) {
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
            columns: ["name", "link", "text"],
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
                    "customComponent": GriddleTableLinkItem
                },
                {
                    "columnName": "text",
                    "order": 3,
                    "locked": false,
                    "visible": false,
                    "cssClassName": "hide"
                }
            ],
            resultsPerPage: 8,
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
                        tableClassName="table table-striped table-hover"
                        useGriddleStyles={false}/>

                </div>
            </div>
        );
    }
});

module.exports = QueryFilter;