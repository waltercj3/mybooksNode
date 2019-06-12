-- myBooks queries

--READ----------------------------------------------------------------------------------------------

--renderMyBooksHome, renderMyBooksAuthors, renderMyBooksBooks, thisAuthor: GET
    --thisAuthor: POST, thisBook: GET, thisBook: POST, myBooksAddEdit: GET
    --isbnResults: GET, addEditBook: POST
SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_id = (?);

--renderMyBooksAuthors
SELECT author_id, author_last_name, author_first_name, author_mid_name \
            FROM Author WHERE author_id IN \
            (SELECT DISTINCT author_id FROM Book WHERE isbn IN \
            (SELECT isbn FROM Book_Reader WHERE reader_id = (?))) \
            ORDER BY author_last_name;

--myBooksAuthors: POST
SELECT reader_id, reader_last_name, reader_first_name FROM Reader \
            WHERE reader_email = (?) AND reader_password = (?);

--renderMyBooksBooks
SELECT Book.isbn, Book.book_title, Book.author_id, Author.author_last_name, \
            Author.author_first_name, Author.author_mid_name \
            FROM Book, Author WHERE Book.author_id = Author.author_id \
            AND (Book.class_id = (?) OR (?) = 0) \
            AND Book.isbn IN (SELECT isbn FROM Book_Reader WHERE reader_id = (?)) \
            ORDER BY Book.book_title;

--renderMyBooksBooks, renderThisBook, myBooksAddEdit: GET
SELECT class_id, class_name, class_description FROM Classification

--renderThisAuthor
SELECT author_id, author_last_name, author_first_name, author_mid_name, \
            DATE_FORMAT(author_date_of_birth, '%Y-%m-%d') AS author_date_of_birth, \
            DATE_FORMAT(author_date_of_birth, '%M %d, %Y') AS author_dob, \
            DATE_FORMAT(author_date_passed, '%Y-%m-%d') AS author_date_passed, \
            DATE_FORMAT(author_date_passed, '%M %d, %Y') AS author_dp \
            FROM Author WHERE author_id = (?);

--renderThisAuthor
SELECT isbn, book_title, orig_pub_date FROM Book WHERE author_id = (?) \
            AND isbn IN (SELECT isbn FROM Book_Reader WHERE reader_id = (?)) \
            ORDER BY orig_pub_date;

--renderThisBook
SELECT Book.isbn, book_title, Book.author_id, author_last_name, author_first_name, \
            author_mid_name, orig_pub_date, class_id, Book_Reader.book_rate_id \
            FROM Book, Author, Book_Reader \
            WHERE Book.isbn = (?) AND Book.author_id = Author.author_id \
            AND Book_Reader.reader_id = (?) AND Book_Reader.isbn = (?);

--renderThisBook, myBooksAddEdit: GET
SELECT book_rate_id, book_rate_description FROM Book_Rating \
            ORDER BY book_rate_id DESC;

--renderThisBook
SELECT author_id, author_last_name, author_first_name, author_mid_name \
            FROM Author;

--isbnResults: GET, addEditBook: POST
SELECT read_date, book_rate_id FROM Book_Reader \
            WHERE reader_id = (?) AND isbn = (?);

--isbnResults: GET
SELECT isbn, author_id, book_title, class_id, orig_pub_date \
            FROM Book WHERE isbn = (?);

--isbnResults: GET, addEditBook: POST
SELECT author_last_name, author_first_name, author_mid_name \
            FROM Author WHERE author_id = (?);

--addEditBook: POST
SELECT * FROM Book WHERE isbn = (?);

--CREATE--------------------------------------------------------------------------------------------

--myBooksHome: POST
INSERT INTO Reader (reader_last_name, reader_first_name, reader_email, reader_password) \
            VALUES (?, ?, ?, ?);

--addEditBook: POST
INSERT INTO Book_Reader (reader_id, isbn, book_rate_id) VALUES (?, ?, ?);

--addEditBook: POST
CALL AddBook(?, ?, ?, ?, ?, ?, ?, ?, ?);

--UPDATE--------------------------------------------------------------------------------------------

--thisAuthor: POST
UPDATE Author SET author_last_name = (?), author_first_name = (?), \
            author_mid_name = (?), author_date_of_birth = (?), author_date_passed = (?) \
            WHERE author_id = (?);

--thisBook: POST
UPDATE Book, Book_Reader \
            SET author_id = (?), book_title = (?), class_id = (?), orig_pub_date = (?), book_rate_id = (?) \
            WHERE Book.isbn = (?) AND Book_Reader.reader_id = (?) AND Book_Reader.isbn = (?);

--DELETE--------------------------------------------------------------------------------------------

--deleteBR: POST
DELETE FROM Book_Reader WHERE reader_id = (?) and isbn = (?);