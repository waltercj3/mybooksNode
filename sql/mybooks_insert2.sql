use mybooks2;

INSERT INTO Classification (class_name, class_description) VALUES
    ('Science Fiction', 'Fiction in a world/universe that could conceivably be our future; a world of "science" as opposed to "magic."'),
    ('Fantasy', 'Fiction in a world/universe that feels like a past and includes some version of "magic."'),
    ('Fiction', 'Fiction that is not "Science Fiction" or "Fantasy."'),
    ('Non-Fiction', NULL);
    
    
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
    
INSERT INTO Book (isbn, author_id, title, orig_pub_date) VALUES
    ('0425034348', 2, 'Podkayne of Mars', 1963),
    ('0345373901', 12, 'Venus in Copper', 1991),
    ('0380792966', 13, 'Child of the River', 13, 1997),
    ('0812543173', 11, 'They Fly at Ciron', 1971),
    ('9781407234687', 10, 'The Book of the New Sun: Shadow and Claw', 1980),
    ('0586042075', 1, 'The Centauri Device', 1974),
    ('0061054003', 8, 'Searoad', 1991), 
    ('0312940513', 7, 'Clans of the Alphane Moon', 1964),
    ('9780765342621', 6, 'Existence', 2012),
    ('9780061177583', 5, 'Ham on Rye: A Novel', 1982),
    ('9780316123419', 4, 'Surface Detail', 2010),
    ('9780316129084', 3, 'Leviathan Wakes', 2011), 
    ('9780553382952', 1, 'Light', 1, 2002);
    