var React = require('react/addons');
    //SearchBox = React.createFactory(require('../components/SearchBox'));

module.exports = function (app) {

    app.get('/', function (req, res) {
        // React.renderToString takes your component
        // and generates the markup

        //var reactHtml = React.renderToString(SearchBox({data: testData}));
        //res.render('index.ejs', {reactOutput: reactHtml});
        res.render('index.ejs', {reactOutput: ''});
    });

};