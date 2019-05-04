use mybooks2;

INSERT INTO Classification (class_name, class_description) VALUES
    ('Science Fiction', 'Fiction in a world/universe that could conceivably be our future; a world of "science" as opposed to "magic."'),
    ('Fantasy', 'Fiction in a world/universe that feels like a past and includes some version of "magic."'),
    ('Fiction', 'Fiction that is not "Science Fiction" or "Fantasy."'),
    ('Non-Fiction', NULL);

INSERT INTO Book_Rating (book_rate_description) VALUES
    ('1. Waste of time'),
    ('2. Barely tolerable'),
    ('3. Worth reading once'),
    ('4. Willing to recommend'),
    ('5. A favorite');
    
INSERT INTO Author (author_last_name, author_first_name, author_mid_name) VALUES
    ('Harrison', 'M.', 'John'),
    ('Heinlein', 'Robert', 'A.'),
    ('Corey', 'James', 'S. A.'),
    ('Banks', 'Iain', 'M.'),
    ('Bukowski', 'Charles', NULL),
    ('Brin', 'David', NULL),
    ('Dick', 'Philip', 'K.'),
    ('Le Guin', 'Ursula', 'K.'),
    ('de Lint', 'Charles', NULL),
    ('Wolfe', 'Gene', NULL),
    ('Delany', 'Samuel', 'R.'),
    ('Davis', 'Lindsey', NULL),
    ('McAuley', 'Paul', 'J.'),
    ('Carver', 'Raymond', NULL),
    ('Morgan', 'Richard', 'K.');
    
INSERT INTO Book (isbn, author_id, book_title, book_class_id, orig_pub_date) VALUES
    ('0425034348', 2, 'Podkayne of Mars', 1, 1963),
    ('0345373901', 12, 'Venus in Copper', 4, 1991),
    ('0380792966', 13, 'Child of the River', NULL, 1997),
    ('0812543173', 11, 'They Fly at Ciron', NULL, 1971),
    ('9781407234687', 10, 'The Book of the New Sun: Shadow and Claw', NULL, 1980),
    ('0586042075', 1, 'The Centauri Device', 1, 1974),
    ('0061054003', 8, 'Searoad', NULL, 1991), 
    ('0312940513', 7, 'Clans of the Alphane Moon', 1, 1964),
    ('9780765342621', 6, 'Existence', 1, 2012),
    ('9780061177583', 5, 'Ham on Rye: A Novel', 4, 1982),
    ('9780316123419', 4, 'Surface Detail', 1, 2010),
    ('9780316129084', 3, 'Leviathan Wakes', 1, 2011), 
    ('9780553382952', 1, 'Light', 1, 2002);

INSERT INTO Reader (reader_last_name, reader_first_name, reader_email, reader_password) VALUES
    ('Reader', 'Gina', 'readgin@email.demo', 'ginaspassword'),
    ('Reader', 'Tommy', 'rommy@email.demo', 'tomspassword');

INSERT INTO Book_Reader (reader_id, isbn, read_date, book_rate_id) VALUES
    (1, '0425034348', NULL, 5),
    (1, '0345373901', NULL, 4),
    (1, '0061054003', NULL, NULL),
    (2, '0586042075', NULL, 5),
    (2, '9780553382952', NULL, 4),
    (2, '9780061177583', NULL, 4),
    (2, '0380792966', NULL, 3),
    (2, '0425034348', NULL, 2),
    (2, '9780765342621', NULL, 1);
