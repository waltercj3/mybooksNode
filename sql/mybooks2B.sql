-- order changed to work on phpmyAdmin

DROP TABLE IF EXISTS `Book_Reader`;
DROP TABLE IF EXISTS `Reader`;
DROP TABLE IF EXISTS `Book_Rating`;
DROP TABLE IF EXISTS `Book`;
DROP TABLE IF EXISTS `Classification`;
DROP TABLE IF EXISTS `Author`;

CREATE TABLE Author
(   author_id int unsigned not null auto_increment primary key,
    author_last_name varchar(255) not null,
    author_first_name varchar(255) DEFAULT '',
    author_mid_name varchar(255) DEFAULT '',
    author_date_of_birth date,
    author_date_passed date
);

CREATE TABLE Classification 
(   class_id tinyint unsigned not null auto_increment primary key,
	class_name varchar(255),
    class_description text
);

CREATE TABLE Book
(   isbn varchar(255) not null primary key,
    author_id int unsigned,
    book_title varchar(255),
    class_id tinyint unsigned,
    orig_pub_date year(4),
    FOREIGN KEY (author_id) REFERENCES Author(author_id),
	FOREIGN KEY (class_id) REFERENCES Classification(class_id)
);

CREATE TABLE Book_Rating 
(   book_rate_id tinyint unsigned not null auto_increment primary key,
	book_rate_description varchar(255)
);

CREATE TABLE Reader
(   reader_id int unsigned not null auto_increment primary key,
	reader_last_name varchar(50) NOT NULL,
    reader_first_name varchar(50) DEFAULT "",
    reader_email varchar(255) NOT NULL,
    reader_password varchar(255) NOT NULL,
    UNIQUE KEY email_password (reader_email, reader_password)
);

CREATE TABLE Book_Reader
(   reader_id int unsigned not null,
	isbn varchar(255) not null,
    read_date date,
    book_rate_id tinyint unsigned,
    PRIMARY KEY (reader_id, isbn),
	FOREIGN KEY (isbn) REFERENCES Book(isbn),
	FOREIGN KEY (book_rate_id) REFERENCES Book_Rating(book_rate_id),
	FOREIGN KEY (reader_id) REFERENCES Reader(reader_id)
);


-- CREATE INDEX book_title ON books (book_title);
-- CREATE INDEX author_name ON authors (author_last_name);
