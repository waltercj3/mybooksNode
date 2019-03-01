// myBooks.js

// Walter Johnson
// CS290, Winter 2019, final project

"use strict";

// one constant to rule them all
const MBG = {
    express: null,
    app: null,
    handlebars: null,
    bodyParser: null,
    path: null,
    mysql: null,
    con: null,
    info: null,
    fs: null,
    shuffleArray: null
};

MBG.express = require('express');

MBG.app = MBG.express();
MBG.handlebars = require('express-handlebars').create({defaultLayout: 'main'});
MBG.bodyParser = require('body-parser');

MBG.app.use(MBG.bodyParser.urlencoded({extended: false}));
MBG.app.use(MBG.bodyParser.json());

MBG.app.engine('handlebars', MBG.handlebars.engine);
MBG.app.set('view engine', 'handlebars');

MBG.path = require('path');
MBG.info = require(MBG.path.resolve(__dirname, "./info.js"));

MBG.app.set('port', MBG.info.port);

MBG.app.use(MBG.express.static(MBG.path.join(__dirname, '/public')));

MBG.mysql = require('mysql');

MBG.con = MBG.mysql.createConnection({
    host: MBG.info.host,
    user: MBG.info.user,
    password: MBG.info.password,
    database: MBG.info.database
});

MBG.fs = require('fs');

MBG.shuffleArray = function (array) {
    var i, j, temp;
    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

MBG.app.get('/', function (req, res) {
    var i, imagesFolder, context = {}; 
    context.items = [];
    imagesFolder = './public/images/';
    MBG.fs.readdir(imagesFolder, function (err, images) {
        if (err) {
            context.error = "Error: could not find image files";
            throw err;
        }
        MBG.shuffleArray(images);
        for (i = 0; i < images.length; i += 1) {
            if (MBG.path.extname(images[i].toLowerCase()) === '.jpg') {
                context.items.push({"image": images[i]});
            }
        }
    });
    res.render('myBooksHome', context);
});

MBG.app.get('/myBooksAuthors', function (req, res) {
    var context = {}, query = "SELECT * FROM authors ORDER BY last_name";
    MBG.con.query(query, function (err, result) {
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
        query = "select books.isbn, books.title, books.author_id, authors.last_name, authors.first_name from books, authors where books.author_id = authors.author_id order by title";
    MBG.con.query(query, function (err, result) {
        if (err) {
            context.error = "Error: Could not connect to database.  Please try again later.";
            throw err;
        }
        context.books = result;
        context.length = result.length;
        res.render('myBooksBooks', context);
    });
});

MBG.app.get('/thisAuthor', function (req, res) {
    var queryAuthor, queryBooks, context = {};

    queryAuthor = "select last_name, first_name from authors where author_id = " + req.query.authorid;
    queryBooks = "select isbn, title, orig_pub_date from books where author_id = " + req.query.authorid + " order by orig_pub_date";

    MBG.con.query(queryAuthor, function (err, resultAuthor) {
        if (err) {
            context.error = "Error: Could not connect to database.  Please try again later.";
            throw err;
        }
        context.author = resultAuthor[0];
        MBG.con.query(queryBooks, function (err, resultBooks) {
            if (err) {
                context.error = "Error: Could not connect to database.  Please try again later.";
                throw err;
            }
            context.length = resultBooks.length;
            if (context.length === 1) {
                context.s = "";
            } else {
                context.s = "s";
            }
            context.books = resultBooks;
            res.render('thisAuthor', context);
        });
    });
});

MBG.app.get('/thisBook', function (req, res) {
    var queryAuthor, queryBook, context = {};

    queryBook = "select * from books where isbn = " + req.query.isbn;
    queryAuthor = "select last_name, first_name from authors where author_id = ";

    MBG.con.query(queryBook, function (err, resultBook) {
        if (err) {
            context.error = "Error: Could not connect to database.  Please try again later.";
            throw err;
        }
        context.book = resultBook[0];
        queryAuthor = queryAuthor + resultBook[0].author_id;
        MBG.con.query(queryAuthor, function (err, resultAuthor) {
            if (err) {
                context.error = "Error: Could not connect to database.  Please try again later.";
                throw err;
            }
            context.author = resultAuthor[0];
            res.render('thisBook', context);
        });
    });
});

MBG.app.get('/myBooksAddEdit', function (req, res) {
    res.render('myBooksAddEdit');
});

MBG.app.get('/myBooksLinks', function (req, res) {
    res.render('myBooksLinks');
});

MBG.app.get('/isbnResults', function (req, res) {
    var queryAuthor, queryBook, response = {};

    queryBook = "select * from books where isbn = " + req.query.isbn;
    queryAuthor = "select last_name, first_name from authors where author_id = ";

    MBG.con.query(queryBook, function (err, resultBook) {
        if (err) {
            response.error = "Could not connect to database.  Please try again later.";
            res.type('plain/text');
            res.status(500);
            res.send('500 - Server Error');
            throw err;
        }
        if (resultBook[0]) {
            response.book = resultBook[0];
            queryAuthor = queryAuthor + resultBook[0].author_id;
            MBG.con.query(queryAuthor, function (err, resultAuthor) {
                if (err) {
                    response.error = "Could not connect to database.  Please try again later.";
                    res.type('plain/text');
                    res.status(500);
                    res.send('500 - Server Error');
                    throw err;
                }
                response.author = resultAuthor[0];
                res.type('application/json');
                res.status(200);
                res.send(response);
            });
        } else {
            response.book = "Book not listed.";
            res.type('application/json');
            res.status(200);
            res.send(response);
        }
    });
});

MBG.app.post('/addEditBook', function (req, res) {
    var response = "The server has received this data, but the database has not been updated as that functionality does not exist yet.";
    res.type('plain/text');
    res.status(200);
    res.send(response);
});

MBG.app.use(function (req, res) {
    res.status(404);
    res.render('404 - Not Found');
});

MBG.app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500 - Internal Server Error');
});

MBG.app.listen(MBG.app.get('port'), function () {
    console.log('Express started on http://localhost:' + MBG.app.get('port') + '; press Ctrl-C to terminate.');
});
