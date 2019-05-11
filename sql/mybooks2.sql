SET FOREIGN_KEY_CHECKS=0; DROP TABLE `Book`; SET FOREIGN_KEY_CHECKS=1; 
CREATE TABLE Book
(   isbn varchar(255) not null primary key,
    author_id int unsigned,
    book_title varchar(255),
    class_id tinyint unsigned,
    orig_pub_date year(4),
    FOREIGN KEY (author_id) REFERENCES Author(author_id),
	FOREIGN KEY (class_id) REFERENCES Classification(class_id)
);

SET FOREIGN_KEY_CHECKS=0; DROP TABLE `Author`; SET FOREIGN_KEY_CHECKS=1;
CREATE TABLE Author
(   author_id int unsigned not null auto_increment primary key,
    author_last_name varchar(255) not null,
    author_first_name varchar(255),
    author_mid_name varchar(255),
    author_date_of_birth date,
    author_date_passed date
);

SET FOREIGN_KEY_CHECKS=0; DROP TABLE `Classification`; SET FOREIGN_KEY_CHECKS=1;
CREATE TABLE Classification 
(   class_id tinyint unsigned not null auto_increment primary key,
	class_name varchar(255),
    class_description text
);

SET FOREIGN_KEY_CHECKS=0; DROP TABLE `Book_rating`; SET FOREIGN_KEY_CHECKS=1;
CREATE TABLE Book_Rating 
(   book_rate_id tinyint unsigned not null auto_increment primary key,
	book_rate_description varchar(255)
);

DROP TABLE IF EXISTS `Book_Reader` ;
FLUSH TABLES `Book_Reader` ; 
CREATE TABLE Book_Reader
(   reader_id int unsigned not null,
	isbn varchar(255) not null,
    read_date date,
    book_rate_id tinyint unsigned,
    PRIMARY KEY (reader_id, isbn),
	FOREIGN KEY (isbn) REFERENCES Book(isbn),
	FOREIGN KEY (book_rate_id) REFERENCES Book_rating(book_rate_id),
	FOREIGN KEY (reader_id) REFERENCES Reader(reader_id)
);

SET FOREIGN_KEY_CHECKS=0; DROP TABLE `Reader`; SET FOREIGN_KEY_CHECKS=1;
CREATE TABLE Reader
(   reader_id int unsigned not null auto_increment primary key,
	reader_last_name varchar(50) not null,
    reader_first_name varchar(50),
    reader_email varchar(255) NOT NULL,
    reader_password varchar(255) NOT NULL,
    UNIQUE KEY email_password (reader_email, reader_password)
);

-- CREATE INDEX book_title ON books (book_title);
-- CREATE INDEX author_name ON authors (author_last_name);
