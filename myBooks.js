// myBooks.js

// Walter Johnson
// CS290, Winter 2019, final project
// this file is based on the "forms-demo.js" file shown in lecture

// one constant to rule them all
const MBG = {
    express: null,
    app: null,
    handlebars: null,
    bodyParser: null,
    path: null,
    mysql: null,
    con: null
};

MBG.express = require('express');

MBG.app = MBG.express();
MBG.handlebars = require('express-handlebars').create({defaultLayout: 'main'});
MBG.bodyParser = require('body-parser');

MBG.app.use(MBG.bodyParser.urlencoded({extended: false}));
MBG.app.use(MBG.bodyParser.json());

MBG.app.engine('handlebars', MBG.handlebars.engine);
MBG.app.set('view engine', 'handlebars');
MBG.app.set('port', 3000);

MBG.path = require('path');
MBG.app.use(MBG.express.static(MBG.path.join(__dirname, '/public')));

MBG.mysql = require('mysql');

MBG.con = MBG.mysql.createConnection({
    host: "localhost",
    user: "mybooks",
    password: "88books!!",
    database: "mybooks"
});


MBG.app.get('/', function (req, res) {
    res.render('myBooksHome');
});

MBG.app.get('/myBooksAuthors', function (req, res) {
    var context = {}, query = "SELECT * FROM authors ORDER BY last_name";
    MBG.con.query(query, function (err, result, fields) {
        if (err) {
            context.error = "Error: Could not connect to database.  Please try again later.";
            throw err;
        }
        context.authors = result;
        context.length = result.length;
        res.render('myBooksAuthors', context);
    });
});

MBG.app.get('/myBooksBooks', function (req, res) {
    var context = {}, 
        query = "select books.isbn, books.title, authors.last_name, authors.first_name from books, authors where books.author_id = authors.author_id order by title";
    MBG.con.query(query, function (err, result, fields) {
        if (err) {
            context.error = "Error: Could not connect to database.  Please try again later.";
            throw err;
        }
        context.books = result;
        context.length = result.length;
        res.render('myBooksBooks', context);
    });
});

MBG.app.get('/myBooksAddEdit', function (req, res) {
    res.render('myBooksAddEdit');
});

MBG.app.get('/way-back', function (req, res) {
    var pair, queryPairs = [], context = {};
    for (pair in req.query){
        queryPairs.push({'name': pair, 'value': req.query[pair]});
    }
    context.queryList = queryPairs;
    res.render('get-back', context);
});

MBG.app.post('/way-back', function (req, res) {
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

MBG.app.use( function (req, res) {
    res.status(404);
    res.render('404');
});

MBG.app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

MBG.app.listen(MBG.app.get('port'), function () {
    console.log('Express started on http://localhost:' + MBG.app.get('port') + '; press Ctrl-C to terminate.');
});
