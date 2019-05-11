-- the following eight SELECT statements are used in early functionality without users
    -- and without add/edit 
SELECT * FROM author ORDER BY author_last_name;

SELECT book.isbn, book.book_title, book.author_id, author.author_last_name, author.author_first_name, author_mid_name 
    FROM book, author WHERE book.author_id = author.author_id ORDER BY book.book_title;

SELECT author_last_name, author_first_name, author_mid_name FROM author WHERE author_id = (?);

SELECT isbn, book_title, orig_pub_date FROM book WHERE author_id = (?) ORDER BY orig_pub_date;

SELECT * FROM book WHERE isbn = (?);

SELECT author_last_name, author_first_name, author_mid_name FROM author WHERE author_id = (?);

SELECT * FROM book WHERE isbn = (?);

SELECT author_last_name, author_first_name, author_mid_name FROM author WHERE author_id = (?);

-- login
SELECT * FROM reader WHERE reader_email = (?) AND reader_password = (?);

-- check password
SELECT reader_password FROM reader WHERE reader_id = (?);

-- create user
INSERT INTO reader (reader_last_name, reader_first_name, reader_email, reader_password) VALUES ((?), (?), (?), (?));

-- edit user name
UPDATE reader SET reader_last_name = (?), reader_first_name = (?) WHERE reader_id = (?);

-- edit user email
UPDATE reader SET reader_email = (?) WHERE reader_id = (?);

-- edit user password
UPDATE reader SET reader_password = (?) WHERE reader_id = (?);

-- delete user
DELETE FROM reader WHERE reader_id = (?);

-- myBooksAuthors
SELECT * FROM author WHERE author_id IN 
	(SELECT DISTINCT author_id FROM book WHERE isbn IN 
    (SELECT isbn FROM book_reader WHERE reader_id = (?)));

-- myBooksBooks
SELECT book.isbn, book.book_title, book.author_id, author.author_last_name, author.author_first_name, author_mid_name
    FROM book, author WHERE book.author_id = author.author_id 
    AND book.isbn IN (SELECT isbn FROM book_reader WHERE reader_id = (?))
    ORDER BY book.book_title;

-- thisAuthor
SELECT isbn, book_title, orig_pub_date FROM book WHERE author_id = (?) 
	AND isbn IN (SELECT isbn FROM book_reader WHERE reader_id = (?))
	ORDER BY orig_pub_date;

-- thisBook
SELECT book.book_title, author.author_last_name, author.author_first_name, author.author_mid_name, book.orig_pub_date, classification.class_name, book_rating.book_rate_description
	FROM book, author, classification, book_rating
    WHERE book.isbn = (?) AND book.author_id = author.author_id AND book.book_class_id = classification.class_id
    AND book_rating.book_rate_id = (SELECT book_rate_id FROM book_reader WHERE isbn = (?) AND reader_id = (?));

-- add author
INSERT INTO author (author_last_name, author_first_name, author_mid_name, author_date_of_birth, author_date_passed) VALUES ((?), (?), (?), (?), (?));
    -- perhaps we shoud insert "." after every intial (single character) that is without

-- get author_id
SELECT author_id FROM author WHERE author_last_name LIKE (?) AND author_first_name LIKE (?) AND author_mid_name LIKE (?);
    -- controller should replace "." with "%" and/or insert "%" after every initial (single character)

-- add user's book (book and book_reader)
INSERT INTO book (isbn, author_id, book_title, book_class_id, orig_pub_date) VALUES ((?), (?), (?), (?), (?));
INSERT INTO book_reader (reader_id, isbn, read_date, book_rate_id) VALUES ((?), (?), (?), (?));
    -- only second INSERT used if the book already exists in database

-- check for book (by isbn) in database
SELECT * FROM book WHERE isbn = (?);

-- edit book
UPDATE book SET author_id = (?) WHERE isbn = (?);
UPDATE book SET book_title = (?) WHERE isbn = (?);
UPDATE book SET book_class_id = (?) WHERE isbn = (?);
UPDATE book SET orig_pub_date = (?) WHERE isbn = (?);
    -- use of each chosen by controller depending on user input

-- edit user book_reader
UPDATE book_reader SET read_date = (?) WHERE reader_id = (?) AND isbn = (?);
UPDATE book_reader SET book_rate_id = (?) WHERE reader_id = (?) AND isbn = (?);

-- delete user book_reader
DELETE FROM book_reader WHERE reader_id = (?) and isbn = (?);

-- get book classifications for form drop down menu
SELECT class_id, class_name FROM classification;

-- get book rating options for form drop down menu
SELECT * FROM book_rating;

