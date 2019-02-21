// myBooks.js

// Walter Johnson
// CS290, Winter 2019, final project
// this file is based on the "forms-demo.js" file shown in lecture

// one constant to rule them all
const GPG = {
    express: null,
    app: null,
    handlebars: null,
    bodyParser: null,
    path: null
};

GPG.express = require('express');

GPG.app = GPG.express();
GPG.handlebars = require('express-handlebars').create({defaultLayout: 'main'});
GPG.bodyParser = require('body-parser');

GPG.app.use(GPG.bodyParser.urlencoded({extended: false}));
GPG.app.use(GPG.bodyParser.json());

GPG.app.engine('handlebars', GPG.handlebars.engine);
GPG.app.set('view engine', 'handlebars');
GPG.app.set('port', 3000);

GPG.path = require('path');
GPG.app.use(GPG.express.static(GPG.path.join(__dirname, '/public')));

GPG.app.get('/', function (req, res) {
    res.render('postGet');
});

GPG.app.get('/way-back', function (req, res) {
    var pair, queryPairs = [], context = {};
    for (pair in req.query){
        queryPairs.push({'name': pair, 'value': req.query[pair]})
    }
    context.queryList = queryPairs;
    res.render('get-back', context);
});

GPG.app.post('/way-back', function (req, res) {
    var pair, queryPairs = [], context = {};

    for (pair in req.query) {
        queryPairs.push({'name': pair, 'value': req.query[pair]})
    }
    context.urlList = queryPairs;

    queryPairs = [];
    for (pair in req.body){
        queryPairs.push({'name':pair,'value':req.body[pair]})
    }
    context.bodyList = queryPairs;
    res.render('post-back', context);
});

GPG.app.use( function (req, res) {
    res.status(404);
    res.render('404');
});

GPG.app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

GPG.app.listen(GPG.app.get('port'), function () {
    console.log('Express started on http://localhost:' + GPG.app.get('port') + '; press Ctrl-C to terminate.');
});
