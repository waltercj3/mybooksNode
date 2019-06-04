--The first 31 queries are in use of a Tuesday, June 3rd with CREATE, READ, UPDATE, 
    --and DELETE functionality.  

--renderMyBooksHome
SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?);

--renderMyBooksAuthors
SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?);
SELECT author_id, author_last_name, author_first_name, author_mid_name \
            FROM Author WHERE author_id IN \
            (SELECT DISTINCT author_id FROM Book WHERE isbn IN \
            (SELECT isbn FROM Book_Reader WHERE reader_id = (?))) \
            ORDER BY author_last_name;

--myBooksAuthors: POST
SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_email = (?) AND reader_password = (?);

--renderMyBooksBooks
SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?);
SELECT Book.isbn, Book.book_title, Book.author_id, Author.author_last_name, \
            Author.author_first_name, Author.author_mid_name \
            FROM Book, Author WHERE Book.author_id = Author.author_id \
            AND Book.isbn IN (SELECT isbn FROM Book_Reader WHERE reader_id = (?)) \
            ORDER BY Book.book_title;

--renderThisAuthor
SELECT author_id, author_last_name, author_first_name, author_mid_name, \
            DATE_FORMAT(author_date_of_birth, '%Y-%m-%d') AS author_date_of_birth, \
            DATE_FORMAT(author_date_of_birth, '%M %d, %Y') AS author_dob, \
            DATE_FORMAT(author_date_passed, '%Y-%m-%d') AS author_date_passed, \
            DATE_FORMAT(author_date_passed, '%M %d, %Y') AS author_dp \
            FROM Author WHERE author_id = (?);
SELECT isbn, book_title, orig_pub_date FROM Book WHERE author_id = (?) \
            AND isbn IN (SELECT isbn FROM Book_Reader WHERE reader_id = (?)) \
            ORDER BY orig_pub_date;

--thisAuthor: GET
SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?);

--thisAuthor: POST
SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?);
UPDATE Author SET author_last_name = (?), author_first_name = (?), \
            author_mid_name = (?), author_date_of_birth = (?), author_date_passed = (?) \
            WHERE author_id = (?);

--renderThisBook
SELECT Book.isbn, book_title, Book.author_id, author_last_name, author_first_name, \
            author_mid_name, orig_pub_date, class_id, Book_Reader.book_rate_id \
            FROM Book, Author, Book_Reader \
            WHERE Book.isbn = (?) AND Book.author_id = Author.author_id \
            AND Book_Reader.reader_id = (?) AND Book_Reader.isbn = (?);
SELECT class_id, class_name FROM Classification;
SELECT book_rate_id, book_rate_description FROM Book_Rating \
            ORDER BY book_rate_id DESC;
SELECT author_id, author_last_name, author_first_name, author_mid_name \
            FROM Author

--thisBook: GET
SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?);

--thisBook: POST
SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?);
UPDATE Book, Book_Reader \
            SET author_id = (?), book_title = (?), class_id = (?), orig_pub_date = (?), book_rate_id = (?) \
            WHERE Book.isbn = (?) AND Book_Reader.reader_id = (?) AND Book_Reader.isbn = (?);

--myBooksAddEdit: GET
SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?);
SELECT class_id, class_name FROM Classification;
SELECT * FROM Book_Rating ORDER BY book_rate_id DESC;

--isbnResults: GET
SELECT reader_id, reader_last_name, reader_first_name \
            FROM Reader WHERE reader_id = (?);
SELECT read_date, book_rate_id FROM Book_Reader \
            WHERE reader_id = (?) AND isbn = (?);
SELECT isbn, author_id, book_title, class_id, orig_pub_date \
            FROM Book WHERE isbn = (?);
SELECT author_last_name, author_first_name, author_mid_name \
            FROM Author WHERE author_id = (?);

--addEditBook: POST
SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?);
SELECT * FROM Book WHERE isbn = (?);
SELECT read_date, book_rate_id FROM Book_Reader \
            WHERE reader_id = (?) AND isbn = (?);
SELECT author_last_name, author_first_name, author_mid_name \
            FROM Author WHERE author_id = (?);
INSERT INTO Book_Reader (reader_id, isbn, book_rate_id) VALUES (?, ?, ?);
CALL AddBook(?, ?, ?, ?, ?, ?, ?, ?, ?);

--The following queries may be used for future functionality

-- create user
INSERT INTO Reader (reader_last_name, reader_first_name, reader_email, reader_password) VALUES ((?), (?), (?), (?));

-- edit user name
UPDATE Reader SET reader_last_name = (?), reader_first_name = (?) WHERE reader_id = (?);

-- edit user email
UPDATE Reader SET reader_email = (?) WHERE reader_id = (?);

-- edit user password
UPDATE Reader SET reader_password = (?) WHERE reader_id = (?);

-- delete user
DELETE FROM Reader WHERE reader_id = (?);

-- filter by Classification
SELECT * FROM Book WHERE class_id = (?);