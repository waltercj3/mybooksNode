DROP TABLE IF EXISTS `Book` ;
FLUSH TABLES `Book` ; 
CREATE TABLE Book
(   isbn char(13) not null primary key,
    author_id int unsigned,
    book_title char(50),
    book_class_id tinyint unsigned,
    orig_pub_date year(4)
);

DROP TABLE IF EXISTS `Author` ;
FLUSH TABLES `Author` ; 
CREATE TABLE Author
(   author_id int unsigned not null auto_increment primary key,
    author_last_name char(50) not null,
    author_first_name char(50),
    author_mid_name char(50),
    author_date_of_birth date,
    author_date_passed date
);

DROP TABLE IF EXISTS `Classification` ;
FLUSH TABLES `Classification`; 
CREATE TABLE Classification 
(   class_id tinyint unsigned not null auto_increment primary key,
	class_name char(50),
    class_description text
);

DROP TABLE IF EXISTS `Book_Reader` ;
FLUSH TABLES `Book_Reader` ; 
CREATE TABLE Book_Reader
(   reader_id int unsigned,
	isbn char(13) not null primary key,
    read_date date,
    book_rate_id tinyint unsigned
);

DROP TABLE IF EXISTS `Reader` ;
FLUSH TABLES `Reader` ; 
CREATE TABLE Reader
(   reader_id int unsigned not null auto_increment primary key,
	reader_last_name char(50) not null,
    reader_first_name char(50),
    reader_email char(50),
    reader_password char(50)
);

-- CREATE INDEX book_title ON books (book_title);
-- CREATE INDEX author_name ON authors (author_last_name);
