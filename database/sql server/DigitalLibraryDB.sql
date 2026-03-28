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
    description VARCHAR(MAX) NULL
    availability VARCHAR(50) NOT NULL DEFAULT 'Available',
    CONSTRAINT CK_RESOURCE_AVAILABILITY CHECK (availability IN ('Available', 'Unavailable')
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
('Nguyen Van A', 'nguyenvana@gmail.com', 'nguyevana123', 'Student'),
('Tran Thi B', 'tranthib@gmail.com', 'tranthib123', 'Student'),
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