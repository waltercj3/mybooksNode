use mybooks2;

DROP PROCEDURE IF EXISTS AddBook;

DELIMITER $$

CREATE PROCEDURE AddBook(
	IN p_isbn varchar(255),
    p_b_title varchar(255),
    p_a_last_name varchar(255), 
	p_a_first_name varchar(255),
    p_a_mid_name varchar(255),
    p_pub_date year(4))
BEGIN
	DECLARE a_id int;

	SELECT author_id INTO a_id
    FROM author
    WHERE author_last_name LIKE p_a_last_name
    AND author_first_name LIKE p_a_first_name
    AND ((author_mid_name LIKE p_a_mid_name) OR (p_a_mid_name IS NULL));
    
    IF a_id IS NULL THEN
		INSERT INTO author (author_last_name, author_first_name, author_mid_name)
		VALUES (p_a_last_name, p_a_first_name, p_a_mid_name);
		SET a_id = LAST_INSERT_ID();
    END IF;
    
    INSERT INTO book (isbn, author_id, book_title, orig_pub_date)
    VALUES (p_isbn, a_id, p_b_title, p_pub_date);

END$$

