DROP TABLE IF EXISTS `Book` ;
FLUSH TABLES `Book` ; 
CREATE TABLE Book
(   isbn varchar(255) not null primary key,
    author_id int unsigned,
    book_title varchar(255),
    book_class_id tinyint unsigned,
    orig_pub_date year(4)
);

DROP TABLE IF EXISTS `Author` ;
FLUSH TABLES `Author` ; 
CREATE TABLE Author
(   author_id int unsigned not null auto_increment primary key,
    author_last_name varchar(255) not null,
    author_first_name varchar(255),
    author_mid_name varchar(255),
    author_date_of_birth date,
    author_date_passed date
);

DROP TABLE IF EXISTS `Classification` ;
FLUSH TABLES `Classification`; 
CREATE TABLE Classification 
(   class_id tinyint unsigned not null auto_increment primary key,
	class_name varchar(255),
    class_description text
);

DROP TABLE IF EXISTS `Book_Reader` ;
FLUSH TABLES `Book_Reader` ; 
CREATE TABLE Book_Reader
(   reader_id int unsigned,
	isbn varchar(255) not null primary key,
    read_date date,
    book_rate_id tinyint unsigned
);

DROP TABLE IF EXISTS `Reader` ;
FLUSH TABLES `Reader` ; 
CREATE TABLE Reader
(   reader_id int unsigned not null auto_increment primary key,
	reader_last_name varchar(50) not null,
    reader_first_name varchar(50),
    reader_email varchar(255) NOT NULL,
    reader_password varchar(255) NOT NULL
);

-- CREATE INDEX book_title ON books (book_title);
-- CREATE INDEX author_name ON authors (author_last_name);
