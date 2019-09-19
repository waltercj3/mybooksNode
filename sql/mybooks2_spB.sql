use mybooks;

DROP PROCEDURE IF EXISTS AddBook;

DELIMITER $$

CREATE PROCEDURE AddBook(
	IN p_isbn varchar(255),
    p_b_title varchar(255),
    p_a_last_name varchar(255), 
	p_a_first_name varchar(255),
    p_a_mid_name varchar(255),
    p_class_id int,
    p_pub_date year(4),
    p_rdr_id int,
    p_brate_id int)
    
BEGIN
	DECLARE a_id int;

	SELECT author_id INTO a_id
    FROM Author
    WHERE author_last_name LIKE p_a_last_name
    AND author_first_name LIKE p_a_first_name
    AND author_mid_name LIKE p_a_mid_name;
    
    PREPARE stmt1 FROM
		'INSERT INTO Author (author_last_name, author_first_name, author_mid_name)
        VALUES (?, ?, ?)';
    
    IF a_id IS NULL THEN
        SET @lname = p_a_last_name;
        SET @fname = p_a_first_name;
        SET @mname = p_a_mid_name;
        EXECUTE stmt1 USING @lname, @fname, @mname;
		SET a_id = LAST_INSERT_ID();
    END IF;
    
    DEALLOCATE PREPARE stmt1;
    
    PREPARE stmt2 FROM
		'INSERT INTO Book (isbn, author_id, book_title, class_id, orig_pub_date)
		VALUES (?, ?, ?, ?, ?)';
	SET @isbn = p_isbn;
	SET @id = a_id;
    SET @title = p_b_title;
    set @class = p_class_id;
    SET @pub = p_pub_date;
    EXECUTE stmt2 USING @isbn, @id, @title, @class, @pub;
    DEALLOCATE PREPARE stmt2;
    
    PREPARE stmt3 FROM
		'INSERT INTO Book_Reader (isbn, reader_id, book_rate_id)
        VALUES (?, ?, ?)';
	SET @isbn = p_isbn;
    SET @rid = p_rdr_id;
    SET @brid = p_brate_id;
    EXECUTE stmt3 USING @isbn, @rid, @brid;
    DEALLOCATE PREPARE stmt3;

END$$

