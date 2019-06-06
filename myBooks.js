// myBooks.js

// Walter Johnson
// CS340, Spring 2019, term project

"use strict";

// one constant to rule them all
const MBG = {
    express: null,
    app: null,
    handlebars: null,
    bodyParser: null,
    path: null,
    info: null,                 // implementation specific values
    utilities: null,            // shared functions and values
    mysql: null,
    pool: null,                 // database connection pool
    fs: null,
    shuffleArray: null,         // function to change order of slideshow
    renderMyBooksHome: null,    // function to render myBooksHome used for every other page when no reader
    renderMyBooksAuthors: null, // function to render myBooksAuthors for both GET and POST
    renderMyBooksBooks: null,   // function to render myBooksBooks for initial GET and for deleteBR POST
    renderThisAuthor: null,     // function to render thisAuthor for both GET and POST
    renderThisBook: null        // function to render thisBook for both GET and POST
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
MBG.info = require("./info.js");
MBG.utilities = require("./public/scripts/utilities.js");

MBG.app.set('port', MBG.info.port);

MBG.app.use(MBG.express.static('public'));

MBG.mysql = require('mysql');

MBG.pool = MBG.mysql.createPool({
    connectionLimit: 100,
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
};

MBG.renderMyBooksHome = function (req, res, context) {
    var i, imagesFolder,
        queryReader = "SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?)";

    context.items = [];
    imagesFolder = './public/images/'; // images for slideshow

    MBG.fs.readdir(imagesFolder, function (err, images) {
        if (err) {
            context.error = "Error: could not find image files";
            console.log(err);
        } else {
            MBG.shuffleArray(images);
            for (i = 0; i < images.length; i += 1) {
                if (MBG.path.extname(images[i].toLowerCase()) === '.jpg') {
                    context.items.push({"image": images[i]});
                }
            }
        }
        if (context.rdr) {
            MBG.pool.query(queryReader, [req.query.rdr], function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if (result[0]) {
                        context.reader = result[0];
                        context.rdr = result[0].reader_id;
                    } else {
                        context.rdr = null;
                    }
                    res.render('myBooksHome', context);
                }
            });
        } else {
            res.render('myBooksHome', context);
        }
    });
};

// home page
MBG.app.get('/', function (req, res) {
    var context = {};
    if (req.query.rdr) {
        context.rdr = req.query.rdr;
    }
    MBG.renderMyBooksHome(req, res, context);
});

// used by both GET and POST requests
MBG.renderMyBooksAuthors = function (req, res, context) {
    var queryReader = "SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?)",
        queryAuthors = "SELECT author_id, author_last_name, author_first_name, author_mid_name \
            FROM Author WHERE author_id IN \
            (SELECT DISTINCT author_id FROM Book WHERE isbn IN \
            (SELECT isbn FROM Book_Reader WHERE reader_id = (?))) \
            ORDER BY author_last_name";

    if (context.rdr) {
        MBG.pool.query(queryReader, [context.rdr], function (err, resultReader) {
            if (err) {
                context.error = "Error: Could not connect to database.  Please try again later.";
                console.log(err);
                res.render('myBooksAuthors', context);
            } else {
                context.reader = resultReader[0];
                MBG.pool.query(queryAuthors, [context.rdr], function (err, resultAuthors) {
                    if (err) {
                        context.error = "Error: Could not connect to database.  Please try again later.";
                        console.log(err);
                    } else {
                        context.authors = resultAuthors;
                        context.length = resultAuthors.length;
                    }
                    res.render('myBooksAuthors', context);
                });
            }
        });
    } else {
        MBG.renderMyBooksHome(req, res, context);
    }
};

// list of authors
MBG.app.get('/myBooksAuthors', function (req, res) {
    var context = {};
    if (req.query.rdr) {
        context.rdr = req.query.rdr;
    }
    MBG.renderMyBooksAuthors(req, res, context)
});

// list of authors, POST from login attempt, failed login returns user to home page
MBG.app.post('/myBooksAuthors', function (req, res) {
    var context = {},
        queryLogin = "SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_email = (?) AND reader_password = (?)";
    
    MBG.pool.query(queryLogin, [req.body.user, req.body.pass], function (err, resultLogin) {
        if (err) {
            context.error = "Error: Could not connect to database.  Please try again later.";
            console.log(err);
            res.render('myBooksAuthors', context);
        } else if (resultLogin[0]) {
            context.rdr = resultLogin[0].reader_id;
            context.reader = resultLogin[0];
            MBG.renderMyBooksAuthors(req, res, context);
        } else {
            context.noReader = "Reader not found with submitted username and password.  Please try again.";
            MBG.renderMyBooksHome(req, res, context);
        }
    });
});

MBG.renderMyBooksBooks = function (req, res, context) {
    var cid, classZero = {class_id: 0, class_name: 'All Classifications', class_description: null},
        queryReader = "SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?)",
        queryBooks = "SELECT Book.isbn, Book.book_title, Book.author_id, Author.author_last_name, \
            Author.author_first_name, Author.author_mid_name \
            FROM Book, Author WHERE Book.author_id = Author.author_id \
            AND (Book.class_id = (?) OR (?) = 0) \
            AND Book.isbn IN (SELECT isbn FROM Book_Reader WHERE reader_id = (?)) \
            ORDER BY Book.book_title",
        queryClasses = "SELECT class_id, class_name, class_description FROM Classification";
   
    if (context.rdr) {
        if (context.classId) {
            cid = parseInt(context.classId);
            if (!(cid >= 0 && cid <= 4)) {
                context.message = "Error, unable to filter book list.";
                cid = 0;
            }
        } else {
            cid = 0;
        }
        MBG.pool.query(queryReader, [context.rdr], function (err, resultReader) {
            if (err) {
                context.error = "Error: Could not connect to database.  Please try again later.";
                console.log(err);
                res.render('myBooksBooks', context);
            } else if (resultReader[0]) {
                context.rdr = resultReader[0].reader_id;
                context.reader = resultReader[0];
                MBG.pool.query(queryBooks, [cid, cid, context.rdr], function (err, resultBooks) {
                    if (err) {
                        context.error = "Error: Could not connect to database.  Please try again later.";
                        console.log(err);
                        res.render('myBooksBooks', context);
                    } else {
                        context.books = resultBooks;
                        context.length = resultBooks.length;
                        MBG.pool.query(queryClasses, function (err, resultClasses) {
                            if (err) {
                                context.error = "Error: Could not connect to database.  Please try again later.";
                                console.log(err);
                                } else {
                                    context.classes = resultClasses;
                                    context.classes.push(classZero);
                                    let lngth = context.classes.length;
                                    for(let i = 0; i < lngth; i += 1) {
                                        if (cid === context.classes[i].class_id) {
                                            context.classes[i].slctd = "selected";
                                        } else {
                                            context.classes[i].slctd = null;
                                        }
                                    }
                                }
                                res.render('myBooksBooks', context);
                            });
                    }
                });
            } else {
                context.rdr = null;
                MBG.renderMyBooksHome(req, res, context);
            }
        });
    } else {
        MBG.renderMyBooksHome(req, res, context);
    }
};

// list of books GET
MBG.app.get('/myBooksBooks', function (req, res) {
    var context = {};
    if (req.query.rdr) {
        context.rdr = req.query.rdr;
    }
    context.rdr = req.query.rdr;
    MBG.renderMyBooksBooks(req, res, context);
});

// list of books POST
MBG.app.post('/myBooksBooks', function (req, res) {
    var context = {};
    if (req.body.rdr) {
        context.rdr = req.body.rdr;
    }
    if (req.body.class) {
        context.classId = req.body.class;
    }
    MBG.renderMyBooksBooks(req, res, context);
});

// used by thisAuthor for both GET and POST
MBG.renderThisAuthor = function (req, res, context) {
    var queryAuthor = "SELECT author_id, author_last_name, author_first_name, author_mid_name, \
            DATE_FORMAT(author_date_of_birth, '%Y-%m-%d') AS author_date_of_birth, \
            DATE_FORMAT(author_date_of_birth, '%M %d, %Y') AS author_dob, \
            DATE_FORMAT(author_date_passed, '%Y-%m-%d') AS author_date_passed, \
            DATE_FORMAT(author_date_passed, '%M %d, %Y') AS author_dp \
            FROM Author WHERE author_id = (?)",
        queryBooks = "SELECT isbn, book_title, orig_pub_date FROM Book WHERE author_id = (?) \
            AND isbn IN (SELECT isbn FROM Book_Reader WHERE reader_id = (?)) \
            ORDER BY orig_pub_date";

    MBG.pool.query(queryAuthor, [req.query.authorid], function (err, resultAuthor) {
        if (err) {
            context.error = "Error: Could not connect to database.  Please try again later.";
            console.log(err);
            res.render('thisAuthor', context);
        } else {
            context.author = resultAuthor[0];
            MBG.pool.query(queryBooks, [req.query.authorid, context.rdr], function (err, resultBooks) {
                if (err) {
                    context.error = "Error: Could not connect to database.  Please try again later.";
                    console.log(err);
                } else {
                    context.length = resultBooks.length;
                    if (context.length === 1) {
                        context.s = "";
                    } else {
                        context.s = "s";
                    }
                    context.books = resultBooks;
                }
                res.render('thisAuthor', context);
            });
        }
    });
};

// selected author and books by same listed
MBG.app.get('/thisAuthor', function (req, res) {
    var context = {},
    queryReader = "SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
        WHERE reader_id = (?)";

    if (req.query.rdr) {
        context.rdr = req.query.rdr;
        MBG.pool.query(queryReader, [context.rdr], function (err, resultReader) {
            if (err) {
                context.error = "Error: Could not connect to database.  Please try again later.";
                console.log(err);
                res.render('thisAuthor', context);
            } else if (resultReader[0]) {
                context.rdr = resultReader[0].reader_id;
                context.reader = resultReader[0];
                MBG.renderThisAuthor(req, res, context);
            } else {
                context.rdr = null;
                MBG.renderMyBooksHome(req, res, context);
            }
        });
    } else {
        MBG.renderMyBooksHome(req, res, context);
    }
});

// edit this author and rerender thisAuthor page
MBG.app.post('/thisAuthor', function (req, res) {
    var dateBorn, datePassed, values = [], context = {},
        queryReader = "SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?)",
        query = "UPDATE Author SET author_last_name = (?), author_first_name = (?), \
            author_mid_name = (?), author_date_of_birth = (?), author_date_passed = (?) \
            WHERE author_id = (?)";

    if (req.body.rdr) {
        context.rdr = req.body.rdr;
        MBG.pool.query(queryReader, [context.rdr], function (err, resultReader) {
            if (err) {
                context.error = "Error: Could not connect to database.  Please try again later.";
                console.log(err);
                res.render('thisAuthor', context);
            } else if (resultReader[0]) {
                context.rdr = resultReader[0].reader_id;
                context.reader = resultReader[0];
                dateBorn = req.body.dateBorn === '' ? null : req.body.dateBorn;
                datePassed = req.body.datePassed === '' ? null : req.body.datePassed;
            
                // if any of these are true, then bad data was intentionally submitted
                if (req.body.lName === "" || req.body.fName === "" || !(dateBorn === null || MBG.utilities.validDateFormat(dateBorn)) || !(datePassed === null || MBG.utilities.validDateFormat(datePassed))) {
                    res.type('plain/text');
                    res.status(400);
                    res.send('400 - Bad Request');
                    return;
                }
            
                values = [req.body.lName, req.body.fName, req.body.mName, dateBorn, datePassed, req.body.author_id];
            
                if (req.query.authorid === req.body.author_id) { // if bad data, don't update
                    MBG.pool.query(query, values, function (err, result) {
                        if (err) {
                            context.error = "Could not connect to database.  Please try again later.";
                            console.log(err);
                            res.render('thisAuthor', context);
                        } else {
                            context.added = true;
                            context.message = "This author's information was successfully updated.";
                            MBG.renderThisAuthor(req, res, context);
                        }
                    });
                } else {
                    res.type('plain/text');
                    res.status(400);
                    res.send('400 - Bad Request');
                    return;
                }
            } else {
                context.rdr = null;
                MBG.renderMyBooksHome(req, res, context);
            }
        });
    } else {
        MBG.renderMyBooksHome(req, res, context);
    }
});

// used by thisBook for both GET and POST
MBG.renderThisBook = function (req, res, context) {
    var queryBook, queryClasses, queryRatings, queryAuthors, isbn;

    queryBook = "SELECT Book.isbn, book_title, Book.author_id, author_last_name, author_first_name, \
        author_mid_name, orig_pub_date, class_id, Book_Reader.book_rate_id \
        FROM Book, Author, Book_Reader \
        WHERE Book.isbn = (?) AND Book.author_id = Author.author_id \
        AND Book_Reader.reader_id = (?) AND Book_Reader.isbn = (?)";
    queryClasses = "SELECT class_id, class_name, class_description FROM Classification";
    queryRatings = "SELECT book_rate_id, book_rate_description FROM Book_Rating \
        ORDER BY book_rate_id DESC";
    queryAuthors = "SELECT author_id, author_last_name, author_first_name, author_mid_name \
        FROM Author";

    isbn = MBG.utilities.validateIsbn(req.query.isbn);

    if (isbn) {
        MBG.pool.query(queryBook, [isbn, context.rdr, isbn], function (err, resultBook) {
            if (err) {
                context.error = "Could not connect to database.  Please try again later.";
                console.log(err);
                res.render('thisBook', context);
            } else {
                context.book = resultBook[0];
                context.book.class_name = resultBook[0].class_name ? resultBook[0].class_name : null;
                MBG.pool.query(queryClasses, function (err, resultClasses) {
                    if (err) {
                        context.error = "Could not connect to database.  Please try again later.";
                        console.log(err);
                        res.render('thisBook', context);
                    } else {
                        context.classes = resultClasses;
                        if (context.book.class_id) { // add the class_name to the book object, null if class_id is null
                            context.book.class_name = resultClasses[context.book.class_id - 1].class_name;
                        } else {
                            context.book.class_name = null;
                        }
                        MBG.pool.query(queryRatings, function (err, resultRatings) {
                            if (err) {
                                context.error = "Could not connect to database.  Please try again later.";
                                console.log(err);
                                res.render('thisBook', context);
                            } else {
                                context.ratings = resultRatings;
                                if (context.book.book_rate_id) {
                                    context.book.book_rate_desc = resultRatings[5 - context.book.book_rate_id].book_rate_description;
                                }
                                MBG.pool.query(queryAuthors, function (err, resultAuthors) {
                                    if (err) {
                                        response.error = "Could not connect to database.  Please try again later.";
                                        console.log(err);
                                    } else {
                                        context.authors = resultAuthors;
                                    }
                                    res.render('thisBook', context);
                                });
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.type('plain/text');
        res.status(400);
        res.send('400 - Bad Request');
    }
};

// selected book
MBG.app.get('/thisBook', function (req, res) {
    var context = {},
    queryReader = "SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
        WHERE reader_id = (?)";

    if (req.query.rdr) {
        context.rdr = req.query.rdr;
        MBG.pool.query(queryReader, [context.rdr], function (err, resultReader) {
            if (err) {
                context.error = "Error: Could not connect to database.  Please try again later.";
                console.log(err);
                res.render('thisAuthor', context);
            } else if (resultReader[0]) {
                context.rdr = resultReader[0].reader_id;
                context.reader = resultReader[0];
                MBG.renderThisBook(req, res, context);
            } else {
                context.rdr = null;
                MBG.renderMyBooksHome(req, res, context);
            }
        });
    } else {
        MBG.renderMyBooksHome(req, res, context);
    }
});

// selected book edited
MBG.app.post('/thisBook', function (req, res) {
    var classId, rateId, values = [], isbn, tempCls, tempRt, tempPub, context = {},
        queryReader = "SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?)",
        query = "UPDATE Book, Book_Reader \
            SET author_id = (?), book_title = (?), class_id = (?), orig_pub_date = (?), book_rate_id = (?) \
            WHERE Book.isbn = (?) AND Book_Reader.reader_id = (?) AND Book_Reader.isbn = (?)";

    if (req.body.rdr) {
        context.rdr = req.body.rdr;
        MBG.pool.query(queryReader, [context.rdr], function (err, resultReader) {
            if (err) {
                context.error = "Error: Could not connect to database.  Please try again later.";
                console.log(err);
                res.render('thisAuthor', context);
            } else if (resultReader[0]) {
                context.rdr = resultReader[0].reader_id;
                context.reader = resultReader[0];
                classId = parseInt(req.body.class) === 0 ? null : req.body.class;
                rateId = parseInt(req.body.rating) === 0 ? null : req.body.rating;
                isbn = MBG.utilities.validateIsbn(req.body.isbn);
                tempCls = parseInt(req.body.class);
                tempRt = parseInt(req.body.rating);
                tempPub = parseInt(req.body.orig_pub_date);

                // if any of these are true, then bad data was intentionally submitted
                if (isbn === 0 || req.body.author_id === "" || !(classId === null || (tempCls >= 1 && tempCls <= 4)) || !(rateId === null || (tempRt >= 1 && tempRt <= 5)) || isNaN(tempPub) || tempPub < 1000 || tempPub > 3000) {
                    res.type('plain/text');
                    res.status(400);
                    res.send('400 - Bad Request');
                    return;
                }

                values = [req.body.author_id, req.body.title, classId, req.body.orig_pub_date, rateId, isbn, context.rdr, isbn];

                if (isbn && (req.query.isbn === req.body.isbn)) { // if bad data, don't update
                    MBG.pool.query(query, values, function (err, result) {
                        if (err) {
                            context.error = "Could not connect to database.  Please try again later.";
                            console.log(err);
                            res.render('thisBook', context);
                        } else {
                            context.added = true;
                            context.message = "This book was successfully updated."
                            MBG.renderThisBook(req, res, context);
                        }
                    });
                } else {
                    res.type('plain/text');
                    res.status(400);
                    res.send('400 - Bad Request');
                    return;
                }
            } else {
                context.rdr = null;
                MBG.renderMyBooksHome(req, res, context);
            }
        });
    } else {
        MBG.renderMyBooksHome(req, res, context);
    }
});

// delete an entry from Book_Reader
MBG.app.post('/deleteBR', function (req, res) {
    var context = {}, response = {},
        queryDelBR = "DELETE FROM Book_Reader WHERE reader_id = (?) and isbn = (?)";

    if (req.body.rdr && req.body.isbn) {
        context.rdr = req.body.rdr;
        MBG.pool.query(queryDelBR, [req.body.rdr, req.body.isbn], function (err, resultDelBR) {
            if (err) {
                response.error = "Could not connect to database.  Please try again later.";
                res.type('plain/text');
                res.status(500);
                res.send('500 - Server Error');
                return;
            } else if (resultDelBR.affectedRows === 1) {
                response.success = true;
            } else {
                response.success = false;
                response.message = "No book was deleted with the submitted data."
            }
            res.type('application/json');
            res.status(200);
            res.send(response);
        });
    } else {
        response.success = false;
        response.message = "Bad data was submitted. No delete was attempted."
        res.type('application/json');
        res.status(200);
        res.send(response);
    }
});

// form to add or edit book
MBG.app.get('/myBooksAddEdit', function (req, res) {
    var context = {},
        queryReader = "SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?)",
        queryClass = "SELECT class_id, class_name, class_description FROM Classification",
        queryRating = "SELECT * FROM Book_Rating ORDER BY book_rate_id DESC";

    if (req.query.rdr) {
        context.rdr = req.query.rdr;
        MBG.pool.query(queryReader, [context.rdr], function (err, resultReader) {
            if (err) {
                context.error = "Error: Could not connect to database.  Please try again later.";
                console.log(err);
                res.render('thisAuthor', context);
            } else if (resultReader[0]) {
                context.rdr = resultReader[0].reader_id;
                context.reader = resultReader[0];
                MBG.pool.query(queryClass, function (err, resultClass) {
                    if (err) {
                        context.error = "Could not connect to database.  Please try again later.";
                        console.log(err);
                        res.render('myBooksAddEdit', context);
                    } else {
                        context.classes = resultClass;
                        MBG.pool.query(queryRating, function (err, resultRating) {
                            if (err) {
                                context.error = "Could not connect to database.  Please try again later.";
                                console.log(err);
                            } else {
                                context.ratings = resultRating;
                            }
                            res.render('myBooksAddEdit', context);
                        });
                    }
                });
            } else {
                context.rdr = null;
                MBG.renderMyBooksHome(req, res, context);
            }
        });
    } else {
        MBG.renderMyBooksHome(req, res, context);
    }
});

// looks up book by isbn, fills in form if book is listed
MBG.app.get('/isbnResults', function (req, res) {
    var isbn, response = {}, context = {},
        queryReader = "SELECT reader_id, reader_last_name, reader_first_name \
            FROM Reader WHERE reader_id = (?)",
        queryBookReader = "SELECT read_date, book_rate_id FROM Book_Reader \
            WHERE reader_id = (?) AND isbn = (?)",
        queryBook = "SELECT isbn, author_id, book_title, class_id, orig_pub_date \
            FROM Book WHERE isbn = (?)",
        queryAuthor = "SELECT author_last_name, author_first_name, author_mid_name \
            FROM Author WHERE author_id = (?)";

    if (req.query.rdr) {
        MBG.pool.query(queryReader, [req.query.rdr], function (err, resultReader) {
            if (err) {
                response.error = "Could not connect to database.  Please try again later.";
                res.type('plain/text');
                res.status(500);
                res.send('500 - Server Error');
                return;
            } else if (resultReader[0]) {
                isbn = MBG.utilities.validateIsbn(req.query.isbn);
                if (isbn) {
                    MBG.pool.query(queryBookReader, [req.query.rdr, isbn], function (err, resultBookReader) {
                        if (err) {
                            response.error = "Could not connect to database.  Please try again later.";
                            res.type('plain/text');
                            res.status(500);
                            res.send('500 - Server Error');
                            return;
                        } else {
                            if (resultBookReader[0]) {
                                response.read = true;
                                response.bookReader = resultBookReader[0];
                            }
                            MBG.pool.query(queryBook, [req.query.isbn], function (err, resultBook) {
                                if (err) {
                                    response.error = "Could not connect to database.  Please try again later.";
                                    res.type('plain/text');
                                    res.status(500);
                                    res.send('500 - Server Error');
                                    return;
                                }
                                if (resultBook[0]) {
                                    response.book = resultBook[0];
                                    MBG.pool.query(queryAuthor, [resultBook[0].author_id], function (err, resultAuthor) {
                                        if (err) {
                                            response.error = "Could not connect to database.  Please try again later.";
                                            res.type('plain/text');
                                            res.status(500);
                                            res.send('500 - Server Error');
                                            return;
                                        }
                                        response.author = resultAuthor[0];
                                        res.type('application/json');
                                        res.status(200);
                                        res.send(response);
                                    });
                                } else {
                                    response.message = "Book not listed.";
                                    res.type('application/json');
                                    res.status(200);
                                    res.send(response);
                                }
                            });
                        }
                    });
                } else {
                    response.message = "ISBN invalid, please try again.";
                    res.type('application/json');
                    res.status(200);
                    res.send(response);}
            } else {
                MBG.renderMyBooksHome(req, res, context);
            }
        });
    } else {
        MBG.renderMyBooksHome(req, res, context);
    }
});

// result of add/edit button on myBooksAddEdit page
MBG.app.post('/addEditBook', function (req, res) {
    var book, auth, tempId, tempPub, values = [], response = {}, context = {},
        queryReader = "SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?)",
        queryBook = 'SELECT * FROM Book WHERE isbn = (?)',
        queryBookReader = "SELECT read_date, book_rate_id FROM Book_Reader \
            WHERE reader_id = (?) AND isbn = (?)",
        queryAuthor = "SELECT author_last_name, author_first_name, author_mid_name \
            FROM Author WHERE author_id = (?)",
        queryAddBR = "INSERT INTO Book_Reader (reader_id, isbn, book_rate_id) VALUES (?, ?, ?)",
        queryAdd = 'CALL AddBook(?, ?, ?, ?, ?, ?, ?, ?, ?)';

    if (req.body.rdr) {
        response.rdr = req.body.rdr;
        MBG.pool.query(queryReader, [response.rdr], function (err, resultReader) {
            if (err) {
                response.error = "Could not connect to database.  Please try again later.";
                res.type('plain/text');
                res.status(500);
                res.send('500 - Server Error');
                return;
            } else if (resultReader[0]) {
                response.rdr = resultReader[0].reader_id;
                response.reader = resultReader[0];
                book = req.body.book;
                auth = req.body.author;
                tempId = parseInt(book.class_id);
                tempPub = parseInt(book.orig_pub_date);
        
                // if any of these are true, then bad data was intentionally submitted
                if (book.isbn === "" || parseInt(book.isbn) === 0 || auth.author_last_name === "" || tempId < 1 || tempId > 4 || isNaN(tempPub) || tempPub < 1000 || tempPub > 3000) {
                    res.type('plain/text');
                    res.status(400);
                    res.send('400 - Bad Request');
                    return;
                }
                MBG.pool.query(queryBook, [book.isbn], function (err, resultBook) {
                    if (err) {
                        response.error = "Could not connect to database.  Please try again later.";
                        res.type('plain/text');
                        res.status(500);
                        res.send('500 - Server Error');
                        return;
                    } else if (resultBook[0]) {
                        response.book = resultBook[0];
                        MBG.pool.query(queryBookReader, [response.rdr, book.isbn], function (err, resultBookReader) {
                            if (err) {
                                response.error = "Could not connect to database.  Please try again later.";
                                res.type('plain/text');
                                res.status(500);
                                res.send('500 - Server Error');
                                return;
                            } else if (resultBookReader[0]) {
                                response.bookReader = resultBookReader[0];
                                MBG.pool.query(queryAuthor, [resultBook[0].author_id], function (err, resultAuthor) {
                                    if (err) {
                                        response.error = "Could not connect to database.  Please try again later.";
                                        res.type('plain/text');
                                        res.status(500);
                                        res.send('500 - Server Error');
                                        return;
                                    }
                                    response.author = resultAuthor[0];
                                    response.added = false;
                                    response.message = "This book is already on your list. No need to add it.";
                                    res.type('application/json');
                                    res.status(200);
                                    res.send(response);
                                });
                            } else {
                                values = [response.rdr, book.isbn, book.book_rate_id];
                                MBG.pool.query(queryAddBR, values, function (err, resultAddBR) {
                                    if (err) {
                                        response.error = "Error: Could not connect to database.  Please try again later.";
                                        res.type('plain/text');
                                        res.status(500);
                                        res.send('500 - Server Error');
                                        return;
                                    } else {
                                        response.added = true;
                                        response.message = "The book was successfully added to your list. Thank you.";
                                        res.type('application/json');
                                        res.status(200);
                                        res.send(response);
                                    }
                                });
                            }
                        });
                    } else {
                        values = [book.isbn, book.book_title, auth.author_last_name, auth.author_first_name, auth.author_mid_name, book.class_id, book.orig_pub_date, response.rdr, book.book_rate_id];
                        MBG.pool.query(queryAdd, values, function (err, result) {
                            if (err) {
                                response.error = "Error: Could not connect to database.  Please try again later.";
                                res.type('plain/text');
                                res.status(500);
                                res.send('500 - Server Error');
                                return;
                            } else {
                                response.added = true;
                                response.message = "The book was successfully added to your list. Thank you.";
                                res.type('application/json');
                                res.status(200);
                                res.send(response);
                            }
                        });
                    }
                });
            } else {
                MBG.renderMyBooksHome(req, res, context);
            }
        });
    } else {
        MBG.renderMyBooksHome(req, res, context);
    }
});

MBG.app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

MBG.app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

MBG.app.listen(MBG.app.get('port'), function () {
    console.log('Express started on http://localhost:' + MBG.app.get('port') + '; press Ctrl-C to terminate.');
});
