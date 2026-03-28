const { sql, poolPromise } = require('../config');
const express = require('express');
const router = express.Router();

const logBorrow = async (req, res) => {
    try {
        const {
            user_id, res_id, borrow_date, return_date, status
        } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input('UserID', sql.Int, user_id)
            .input('ResID', sql.Int, res_id)
            .input('BorrowDate', sql.DateTime, borrow_date)
            .input('ReturnDate', sql.DateTime, return_date)
            .input('Status', sql.NVarChar, status)
            .query(`
                INSERT INTO dbo.BorrowLog (user_id, res_id, borrow_date, return_date, status)
                VALUES (@UserID, @ResID, @BorrowDate, @ReturnDate, @Status)
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

const getBorrowLogs = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .query(`
                SELECT * FROM dbo.BorrowLog
            `);

        return res.status(200).json({
            success: true,
            message: 'Success',
            data: result.recordset
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const log = async (req, res) => {
    try {
        const {
            user_id, action, timestamp
        } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input('UserID', sql.Int, user_id)
            .input('Action', sql.NVarChar, action)
            .input('Timestamp', sql.DateTime, timestamp || new Date())
            .query(`
                INSERT INTO dbo.SYSTEM_LOG (user_id, action, timestamp)
                VALUES (@UserID, @Action, @Timestamp)
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

const getLogs = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .query(`
                SELECT * FROM dbo.SYSTEM_LOG
            `);

        return res.status(200).json({
            success: true,
            message: 'Success',
            data: result.recordset
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

router.post('/log/borrow', logBorrow);
router.get('/log/borrow', getBorrowLogs);
router.post('/log', log);
router.get('/log', getLogs);

module.exports = router;