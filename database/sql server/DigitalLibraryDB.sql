CREATE DATABASE DigitalLibraryDB;
GO

USE DigitalLibraryDB;
GO

IF OBJECT_ID('dbo.SYSTEM_LOG', 'U') IS NOT NULL DROP TABLE dbo.SYSTEM_LOG;
IF OBJECT_ID('dbo.BORROW_RECORD', 'U') IS NOT NULL DROP TABLE dbo.BORROW_RECORD;
IF OBJECT_ID('dbo.BOOKMARK', 'U') IS NOT NULL DROP TABLE dbo.BOOKMARK;
IF OBJECT_ID('dbo.RESOURCE', 'U') IS NOT NULL DROP TABLE dbo.RESOURCE;
IF OBJECT_ID('dbo.[USER]', 'U') IS NOT NULL DROP TABLE dbo.[USER];
GO

-- USER
CREATE TABLE dbo.[USER] (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    nickname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    [password] VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    creationDate DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- USER PREFERENCES
CREATE TABLE dbo.USERPREFERENCE (
    user_id INT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    count INT NOT NULL,
    lastRead DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_USER_PREFERENCE FOREIGN KEY (user_id)
        REFERENCES dbo.[USER](user_id)
        ON DELETE CASCADE,
);
GO

-- RESOURCE
CREATE TABLE dbo.RESOURCE (
    res_id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150) NOT NULL,
    description VARCHAR(MAX) NULL,
    availability VARCHAR(50) NOT NULL DEFAULT 'Available',
    CONSTRAINT CK_RESOURCE_AVAILABILITY CHECK (availability IN ('Available', 'Unavailable'))
);
GO

-- RESOURCE CATEGORY
CREATE TABLE dbo.RESOURCECATEGORY(
    res_id INT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    CONSTRAINT FK_RESOURCE_CATEGORY FOREIGN KEY (res_id)
        REFERENCES dbo.RESOURCE(res_id)
        ON DELETE CASCADE
);
GO

-- BOOKMARK
CREATE TABLE dbo.BOOKMARK (
    user_id INT NOT NULL,
    res_id INT NOT NULL,
    bm_id INT IDENTITY(1,1) PRIMARY KEY,
    CONSTRAINT FK_BOOKMARK_USER FOREIGN KEY (user_id)
        REFERENCES dbo.[USER](user_id)
        ON DELETE CASCADE,
    CONSTRAINT FK_BOOKMARK_RESOURCE FOREIGN KEY (res_id)
        REFERENCES dbo.RESOURCE(res_id)
        ON DELETE CASCADE
);
GO

-- BORROW_RECORD
CREATE TABLE dbo.BORROW_RECORD (
    borrow_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    res_id INT NOT NULL,
    borrow_date DATETIME NOT NULL DEFAULT GETDATE(),
    return_date DATETIME NULL,
    status VARCHAR(50) NOT NULL,
    CONSTRAINT FK_BORROW_USER FOREIGN KEY (user_id)
        REFERENCES dbo.[USER](user_id)
        ON DELETE CASCADE,
    CONSTRAINT FK_BORROW_RESOURCE FOREIGN KEY (res_id)
        REFERENCES dbo.RESOURCE(res_id)
        ON DELETE CASCADE,
    CONSTRAINT CK_BORROW_STATUS CHECK (status IN ('Borrowed', 'Returned', 'Overdue'))
);
GO

-- SYSTEM_LOG
CREATE TABLE dbo.SYSTEM_LOG (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    [timestamp] DATETIME NOT NULL DEFAULT GETDATE(),
);
GO

-- USER sample data
INSERT INTO dbo.[USER] (nickname, email, [password], role)
VALUES
('Nguyen Van A', 'nguyenvana@gmail.com', 'nguyevana123', 'User'),
('Tran Thi B', 'tranthib@gmail.com', 'tranthib123', 'User'),
('Le Minh C', 'leminhc@gmail.com', 'leminhc123', 'Admin');
GO

-- RESOURCE sample data
INSERT INTO dbo.RESOURCE (title, author, description)
VALUES
('Database Fundamentals', 'Thomas Connolly', 'Introduction to database systems'),
('Python for Data Analysis', 'Wes McKinney', 'Data analysis using Python'),
('Machine Learning Basics', 'Andrew Ng', 'Basic concepts of machine learning'),
('Operating System Concepts', 'Silberschatz', 'OS principles'),
('Web Development with HTML CSS', 'Jon Duckett', 'Frontend web development');
GO

INSERT INTO dbo.RESOURCECATEGORY (res_id, category)
VALUES
((SELECT res_id from dbo.RESOURCE WHERE title = 'Database Fundamentals'), 'Database'),
((SELECT res_id from dbo.RESOURCE WHERE title = 'Python for Data Analysis'), 'Programming'),
((SELECT res_id from dbo.RESOURCE WHERE title = 'Machine Learning Basics'), 'AI'),
((SELECT res_id from dbo.RESOURCE WHERE title = 'Operating System Concepts'), 'Computer Science'),
((SELECT res_id from dbo.RESOURCE WHERE title = 'Web Development with HTML CSS'), 'Web');
GO

-- BOOKMARK sample data
INSERT INTO dbo.BOOKMARK (user_id, res_id)
VALUES
(1, 1),
(1, 3),
(2, 2),
(2, 5);
GO

-- BORROW_RECORD sample data
INSERT INTO dbo.BORROW_RECORD (user_id, res_id, borrow_date, return_date, status)
VALUES
(1, 1, '2026-03-10', NULL, 'Borrowed'),
(2, 2, '2026-03-05', '2026-03-12', 'Returned'),
(1, 3, '2026-03-01', NULL, 'Overdue');
GO

-- SYSTEM_LOG sample data
INSERT INTO dbo.SYSTEM_LOG (user_id, action, [timestamp])
VALUES
(1, 'Login', '2026-03-15 08:00:00'),
(1, 'Bookmarked resource 3', '2026-03-15 08:10:00'),
(2, 'Borrowed resource 2', '2026-03-15 09:00:00'),
(3, 'Updated resource information', '2026-03-15 10:00:00');
GO

-- ADDITIONAL USER sample data
INSERT INTO dbo.[USER] (nickname, email, [password], role)
VALUES
('Pham Quoc D', 'phamquocd@gmail.com', 'phamquocd123', 'User'),
('Vo Ngoc E', 'vongoce@gmail.com', 'vongoce123', 'User'),
('Bui Thanh F', 'buithanhf@gmail.com', 'buithanhf123', 'User'),
('Do Mai G', 'domaig@gmail.com', 'domaig123', 'User'),
('Ngo Duc H', 'ngoduch@gmail.com', 'ngoduch123', 'User'),
('Pham Nhat I', 'phamnhati@gmail.com', 'phamnhati123', 'Admin'),
('Hoang Linh J', 'hoanglinhj@gmail.com', 'hoanglinhj123', 'User');
GO

-- ADDITIONAL RESOURCE sample data
INSERT INTO dbo.RESOURCE (title, author, description)
VALUES
('Clean Code', 'Robert C. Martin', 'A handbook of agile software craftsmanship'),
('Design Patterns', 'Erich Gamma', 'Elements of reusable object-oriented software'),
('Deep Learning', 'Ian Goodfellow', 'Comprehensive deep learning foundations'),
('Computer Networks', 'Andrew S. Tanenbaum', 'Classic introduction to networking concepts'),
('The Pragmatic Programmer', 'Andrew Hunt', 'Practical software engineering practices'),
('Refactoring', 'Martin Fowler', 'Improving design of existing code'),
('Artificial Intelligence: A Modern Approach', 'Stuart Russell', 'Standard textbook for AI'),
('Introduction to Algorithms', 'Thomas H. Cormen', 'Core algorithms and data structures'),
('Effective Java', 'Joshua Bloch', 'Best practices for Java programming'),
('Modern Operating Systems', 'Andrew S. Tanenbaum', 'Advanced operating systems concepts');
GO

INSERT INTO dbo.RESOURCECATEGORY (res_id, category)
VALUES
((SELECT res_id FROM dbo.RESOURCE WHERE title = 'Clean Code'), 'Software Engineering'),
((SELECT res_id FROM dbo.RESOURCE WHERE title = 'Design Patterns'), 'Software Engineering'),
((SELECT res_id FROM dbo.RESOURCE WHERE title = 'Deep Learning'), 'AI'),
((SELECT res_id FROM dbo.RESOURCE WHERE title = 'Computer Networks'), 'Computer Science'),
((SELECT res_id FROM dbo.RESOURCE WHERE title = 'The Pragmatic Programmer'), 'Software Engineering'),
((SELECT res_id FROM dbo.RESOURCE WHERE title = 'Refactoring'), 'Software Engineering'),
((SELECT res_id FROM dbo.RESOURCE WHERE title = 'Artificial Intelligence: A Modern Approach'), 'AI'),
((SELECT res_id FROM dbo.RESOURCE WHERE title = 'Introduction to Algorithms'), 'Programming'),
((SELECT res_id FROM dbo.RESOURCE WHERE title = 'Effective Java'), 'Programming'),
((SELECT res_id FROM dbo.RESOURCE WHERE title = 'Modern Operating Systems'), 'Computer Science');
GO

-- ADDITIONAL BOOKMARK sample data
INSERT INTO dbo.BOOKMARK (user_id, res_id)
VALUES
(3, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Clean Code')),
(4, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Design Patterns')),
(4, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Deep Learning')),
(5, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Computer Networks')),
(6, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'The Pragmatic Programmer')),
(7, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Refactoring')),
(8, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Artificial Intelligence: A Modern Approach')),
(9, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Introduction to Algorithms')),
(10, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Effective Java'));
GO

-- ADDITIONAL BORROW_RECORD sample data
INSERT INTO dbo.BORROW_RECORD (user_id, res_id, borrow_date, return_date, status)
VALUES
(3, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Clean Code'), '2026-03-18', NULL, 'Borrowed'),
(4, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Design Patterns'), '2026-03-10', '2026-03-17', 'Returned'),
(5, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Deep Learning'), '2026-03-07', NULL, 'Overdue'),
(6, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Computer Networks'), '2026-03-20', NULL, 'Borrowed'),
(7, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'The Pragmatic Programmer'), '2026-03-11', '2026-03-19', 'Returned'),
(8, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Refactoring'), '2026-03-05', NULL, 'Overdue'),
(9, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Artificial Intelligence: A Modern Approach'), '2026-03-21', NULL, 'Borrowed'),
(10, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Introduction to Algorithms'), '2026-03-08', '2026-03-15', 'Returned'),
(1, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Effective Java'), '2026-03-22', NULL, 'Borrowed'),
(2, (SELECT res_id FROM dbo.RESOURCE WHERE title = 'Modern Operating Systems'), '2026-03-04', NULL, 'Overdue');
GO

-- ADDITIONAL SYSTEM_LOG sample data
INSERT INTO dbo.SYSTEM_LOG (user_id, action, [timestamp])
VALUES
(4, 'Login', '2026-03-16 07:45:00'),
(4, 'Borrowed Design Patterns', '2026-03-16 08:00:00'),
(5, 'Searched AI resources', '2026-03-16 08:20:00'),
(6, 'Added bookmark for Computer Networks', '2026-03-16 08:35:00'),
(7, 'Returned The Pragmatic Programmer', '2026-03-16 09:10:00'),
(8, 'Updated profile settings', '2026-03-16 09:25:00'),
(9, 'Borrowed AI: A Modern Approach', '2026-03-16 09:40:00'),
(10, 'Reviewed borrowing history', '2026-03-16 10:00:00'),
(3, 'Admin generated monthly report', '2026-03-16 10:30:00'),
(9, 'Logged out', '2026-03-16 10:45:00');
GO