CREATE TABLE books
(   isbn char(13) not null primary key,
    title char(100),
    author_id int unsigned,
    class_id tinyint unsigned,
    book_rate_id tinyint unsigned,
    orig_pub_date year(4),
    curr_ed_date year(4)
);

CREATE TABLE authors
(   author_id int unsigned not null auto_increment primary key,
    last_name char(50) not null,
    first_name char(50),
    date_of_birth date,
    date_passed date,
    author_rate_id tinyint unsigned
);

CREATE TABLE author_rate
(   author_rate_id tinyint unsigned not null primary key,
    author_rate_description text
);

CREATE TABLE book_covers
(   isbn char(13) not null primary key,
    cover_image blob not null
);

CREATE TABLE book_rate
(   book_rate_id tinyint unsigned not null primary key,
    book_rate_description text
);

CREATE TABLE classifications
(   class_id tinyint unsigned not null auto_increment primary key,
    class_name char(50) not null,
    class_description text
);

CREATE INDEX book_title ON books (title);
CREATE INDEX author_name ON authors (last_name);
