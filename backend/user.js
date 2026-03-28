const { sql, poolPromise } = require('../config');
const express = require('express');
const router = express.Router();

const login = async (req, res) => {
    try {
        const {
            username, password 
        } = req.body;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('Username', sql.NVarChar, username)
            .input('Password', sql.NVarChar, password)
            .query(`
                SELECT AccountType, Username 
                FROM [User].Account 
                WHERE (Username = @Username OR EmailMain = @Username) AND HashedPassword = @Password
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'Incorrect username or password' });
        }
        
        const user = result.recordset[0];

        return res.status(200).json({
            success: true,
            message: 'Success',
            role: user.AccountType
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const getAccount = async (req, res) => {
    try {
        const { user_id } = req.query;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('UserID', sql.Int, user_id)
            .query(`
                SELECT user_id, nickname, email, password, role FROM dbo.[USER] WHERE user_id = @UserID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = result.recordset[0];

        return res.status(200).json({
            success: true,
            message: 'Success',
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const createAccount = async (req, res) => {
    try {
        const {
            nickname, email, password, role
        } = req.body;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('Nickname', sql.NVarChar, nickname)
            .input('Email', sql.NVarChar, email)
            .input('Password', sql.NVarChar, password)
            .input('Role', sql.NVarChar, role)
            .query(`
                INSERT INTO dbo.[USER] (nickname, email, password, role) VALUES (@Nickname, @Email, @Password, @Role)
            `);

        return res.status(200).json({
            success: true,
            message: 'Success'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const editAccount = async (req, res) => {
    try {
        const {
            user_id, nickname, email, password, role
        } = req.body;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('UserID', sql.Int, user_id)
            .input('Nickname', sql.NVarChar, nickname)
            .input('Email', sql.NVarChar, email)
            .input('Password', sql.NVarChar, password)
            .input('Role', sql.NVarChar, role)
            .query(`
                UPDATE dbo.[USER] SET nickname = @Nickname, email = @Email, password = @Password, role = @Role WHERE user_id = @UserID
            `);

        return res.status(200).json({
            success: true,
            message: 'Success'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const deleteAccount = async (req, res) => {
    try {
        const { user_id } = req.body;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('UserID', sql.Int, user_id)
            .query(`
                DELETE FROM dbo.[USER] WHERE user_id = @UserID
            `);

        return res.status(200).json({
            success: true,
            message: 'Success'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const updateUserPref = async (req, res) => {
    try {
        const { user_id, category, countChange, lastread } = req.body;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('UserID', sql.Int, user_id)
            .input('Category', sql.NVarChar, category)
            .input('CountChange', sql.Int, countChange)
            .input('LastRead', sql.DateTime, lastread)
            .query(`
                IF EXISTS (SELECT category FROM dbo.USERPREFERENCE WHERE category = @Category AND user_id = @UserID)
                BEGIN
                    IF EXISTS (SELECT category FROM dbo.USERPREFERENCE WHERE category = @Category AND user_id = @UserID AND count + @CountChange <= 0)
                    BEGIN
                        DELETE FROM dbo.USERPREFERENCE WHERE category = @Category AND user_id = @UserID
                    END
                    ELSE
                    BEGIN
                        UPDATE dbo.USERPREFERENCE SET category = @Category, count = count + @CountChange, lastread = @LastRead WHERE user_id = @UserID
                    END
                END
                ELSE
                BEGIN
                    INSERT INTO dbo.USERPREFERENCE (user_id, category, count, lastread) VALUES (@UserID, @Category, count + @CountChange, @LastRead)
                END
            `);

        return res.status(200).json({
            success: true,
            message: 'Success'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

router.post('/login', login);
router.get('/accounts', getAccount);
router.post('/accounts', createAccount);
router.put('/accounts', editAccount);
router.delete('/accounts', deleteAccount);
router.post('/preferences', updateUserPref);

module.exports = router;