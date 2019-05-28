-- the first 17 queries are in use as of 5/27/19, 
    -- the site lacks Reader, Book_Reader functionality ass well as DELETE or FILTER functionality

-- myBooksAuthors
SELECT * FROM Author ORDER BY author_last_name;

-- myBooksBooks
SELECT Book.isbn, Book.book_title, Book.author_id, Author.author_last_name, 
    Author.author_first_name, Author.author_mid_name 
    FROM Book, Author WHERE Book.author_id = Author.author_id ORDER BY Book.book_title;

-- thisAuthor: renderThisAuthor
SELECT author_id, author_last_name, author_first_name, author_mid_name, 
    DATE_FORMAT(author_date_of_birth, '%Y-%m-%d') AS author_date_of_birth, 
    DATE_FORMAT(author_date_of_birth, '%M %d, %Y') AS author_dob, 
    DATE_FORMAT(author_date_passed, '%Y-%m-%d') AS author_date_passed, 
    DATE_FORMAT(author_date_passed, '%M %d, %Y') AS author_dp 
    FROM Author WHERE author_id = (?);

SELECT isbn, book_title, orig_pub_date FROM Book WHERE author_id = (?) ORDER BY orig_pub_date;

-- thisAuthor: POST
UPDATE Author SET author_last_name = (?), author_first_name = (?), author_mid_name = (?), 
    author_date_of_birth = (?), author_date_passed = (?) WHERE author_id = (?);

-- thisBook: renderThisBook
SELECT isbn, book_title, Book.author_id, author_last_name, author_first_name, 
    author_mid_name, orig_pub_date, Book.class_id 
    FROM Book, Author, Classification 
    WHERE Book.isbn = (?) AND Book.author_id = Author.author_id;

SELECT class_id, class_name FROM Classification;

SELECT book_rate_id, book_rate_description FROM Book_Rating ORDER BY book_rate_id DESC;

SELECT author_id, author_last_name, author_first_name, author_mid_name FROM Author;

-- thisBook: POST
UPDATE Book SET author_id = (?), book_title = (?), class_id = (?), orig_pub_date = (?) 
    WHERE isbn = (?);

-- myBooksAddEdit
SELECT class_id, class_name FROM Classification

SELECT * FROM Book_Rating ORDER BY book_rate_id DESC

-- isbnResults
SELECT * FROM Book WHERE isbn = (?);

SELECT author_last_name, author_first_name, author_mid_name FROM Author WHERE author_id = (?);

-- addEditBook
SELECT * FROM Book WHERE isbn = (?);

SELECT author_last_name, author_first_name, author_mid_name FROM Author WHERE author_id = (?);

CALL AddBook(?, ?, ?, ?, ?, ?, ?);

-- for future functionality (Reader, Book_Reader, DELETE, FILTER)

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

-- add user's book (book and book_reader)
INSERT INTO book (isbn, author_id, book_title, book_class_id, orig_pub_date) VALUES ((?), (?), (?), (?), (?));
INSERT INTO book_reader (reader_id, isbn, read_date, book_rate_id) VALUES ((?), (?), (?), (?));
    -- only second INSERT used if the book already exists in database

-- edit user book_reader
UPDATE book_reader SET read_date = (?) WHERE reader_id = (?) AND isbn = (?);
UPDATE book_reader SET book_rate_id = (?) WHERE reader_id = (?) AND isbn = (?);

-- delete user book_reader
DELETE FROM book_reader WHERE reader_id = (?) and isbn = (?);