use mybooks;

INSERT INTO classifications VALUES
    (NULL, 'Science Fiction', 'Fiction in a world/universe that could conceivably be our future; a world of "science" as opposed to "magic."'),
    (NULL, 'Fantasy', 'Fiction in a world/universe that feels like a past and includes some version of "magic."'),
    (NULL, 'Fiction', 'Fiction that is not "Science Fiction" or "Fantasy."'),
    (NULL, 'Non-Fiction', NULL);
    
    
INSERT INTO authors (last_name, first_name) VALUES
    ('Harrison', 'M. John'),
    ('Heinlein', 'Robert A.'),
    ('Corey', 'James S. A.'),
    ('Banks', 'Iain M.'),
    ('Bukowski', 'Charles'),
    ('Brin', 'David'),
    ('Dick', 'Philip K.'),
    ('Le Guin', 'Ursula K.'),
    ('de Lint', 'Charles'),
    ('Wolfe', 'Gene'),
    ('Delany', 'Samuel R.'),
    ('Davis', 'Lindsey'),
    ('McAuley', 'Paul J.'),
    ('Carver', 'Raymond'),
    ('Morgan', 'Richard K.');
    
INSERT INTO books (isbn, title, author_id, orig_pub_date, curr_ed_date) VALUES
    ('0425034348', 'Podkayne of Mars', 2, 1963, 1970),
    ('0345373901', 'Venus in Copper', 12, 1991, 1991),
    ('0380792966', 'Child of the River', 13, 1997, 1997),
    ('0812543173', 'They Fly at Ciron', 11, 1971, 1996),
    ('9781407234687', 'The Book of the New Sun: Shadow and Claw', 10, 1980, 2011),
    ('0586042075', 'The Centauri Device', 1, 1974, 1975),
    ('0061054003', 'Searoad', 8, 1991, 1994), 
    ('0312940513', 'Clans of the Alphane Moon', 7, 1964, 1964),
    ('9780765342621', 'Existence', 6, 2012, 2013),
    ('9780061177583', 'Ham on Rye: A Novel', 5, 1982, 2002),
    ('9780316123419', 'Surface Detail', 4, 2010, 2011),
    ('9780316129084', 'Leviathan Wakes', 3, 2011, 2011), 
    ('9780553382952', 'Light', 1, 2002, 2004);
    