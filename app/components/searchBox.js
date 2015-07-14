/** @jsx React.DOM */

var React = require('react/addons');

var SearchBox = React.createClass({
    getInitialState: function () {
        return {
            message : 'Input search criteria......'
        };
    },
    search:function(){
        var query=this.refs.searchInput.getDOMNode().value; // this is the search text
        this.props.search(query);
    },
    render: function () {
        return (
            <input type="text" ref="searchInput" className="form-control" placeholder={this.state.message} value={this.props.query} onChange={this.search}/>
        );
    }
});

var TableItem = React.createClass({
    render: function() {
        return <tr><td>{this.props.data.name}</td><td>{this.props.data.link}</td></tr>;
    }
});

var DisplayTable = React.createClass({
    render:function(){
        //making the rows to display
        var rows=[];
        this.props.data.forEach(function(link, index) {
            rows.push(<TableItem key={index} data={link}/>)
        });
        //returning the table
        return(
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
    search:function(queryText){
        console.log(queryText);
        //get query result
        var queryResult=[];
        this.props.data.forEach(function(link){
            if(link.name.toLowerCase().indexOf(queryText.toLowerCase())!=-1)
                queryResult.push(link);
        });

        this.setState({
            query:queryText,
            filteredData: queryResult
        })
    },

    getInitialState:function(){
        return{
            query:'',
            filteredData: this.props.data
        }
    },

    render:function(){
        return (
            <div className="QueryFilter">
                <SearchBox query={this.state.query} search={this.search}/>
                <br/>
                <DisplayTable data={this.state.filteredData}/>
            </div>
        );
    }
});

module.exports = QueryFilter;
//    queryFilter: QueryFilter
//};

/* create factory with griddle component */
//var Griddle = React.createFactory(require('griddle-react'));
//
//var fakeData = require('../data/fakeData.js').fakeData;
//var columnMeta = require('../data/columnMeta.js').columnMeta;
//var resultsPerPage = 200;
//
//var ReactApp = React.createClass({
//
//      componentDidMount: function () {
//        console.log(fakeData);
//
//      },
//      render: function () {
//        return (
//          <div id="table-area">
//
//             <Griddle results={fakeData}
//                      columnMetadata={columnMeta}
//                      resultsPerPage={resultsPerPage}
//                      tableClassName="table"/>
//
//          </div>
//        )
//      }
//  });

/* Module.exports instead of normal dom mounting */
//module.exports = ReactApp;