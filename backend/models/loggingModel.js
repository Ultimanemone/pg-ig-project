const { sql, poolPromise } = require('../../config');

const logBorrow = async ({ user_id, res_id, borrow_date, return_date, status }) => {
    const pool = await poolPromise;

    await pool.request()
        .input('UserID', sql.Int, user_id)
        .input('ResID', sql.Int, res_id)
        .input('BorrowDate', sql.DateTime, borrow_date)
        .input('ReturnDate', sql.DateTime, return_date)
        .input('Status', sql.NVarChar, status)
        .query(`
            INSERT INTO dbo.BORROW_RECORD (user_id, res_id, borrow_date, return_date, status)
            VALUES (@UserID, @ResID, @BorrowDate, @ReturnDate, @Status)
        `);
};

const getBorrowLogs = async (userId) => {
    const pool = await poolPromise;

    const request = pool.request();
    let whereClause = '';

    if (userId) {
        request.input('UserID', sql.Int, userId);
        whereClause = 'WHERE br.user_id = @UserID';
    }

    const result = await request.query(`
        SELECT br.borrow_id, br.user_id, br.res_id, br.borrow_date, br.return_date, br.status,
               u.nickname, u.email, r.title, r.author
        FROM dbo.BORROW_RECORD br
        INNER JOIN dbo.[USER] u ON u.user_id = br.user_id
        INNER JOIN dbo.RESOURCE r ON r.res_id = br.res_id
        ${whereClause}
        ORDER BY br.borrow_date DESC
    `);

    return result.recordset;
};

const updateBorrow = async ({ borrow_id, user_id, res_id, borrow_date, return_date, status }) => {
    const pool = await poolPromise;

    await pool.request()
        .input('BorrowID', sql.Int, borrow_id)
        .input('UserID', sql.Int, user_id)
        .input('ResID', sql.Int, res_id)
        .input('BorrowDate', sql.DateTime, borrow_date)
        .input('ReturnDate', sql.DateTime, return_date)
        .input('Status', sql.NVarChar, status)
        .query(`
            UPDATE dbo.BORROW_RECORD
            SET user_id = @UserID,
                res_id = @ResID,
                borrow_date = @BorrowDate,
                return_date = @ReturnDate,
                status = @Status
            WHERE borrow_id = @BorrowID
        `);
};

const deleteBorrow = async (borrowId) => {
    const pool = await poolPromise;

    await pool.request()
        .input('BorrowID', sql.Int, borrowId)
        .query(`
            DELETE FROM dbo.BORROW_RECORD
            WHERE borrow_id = @BorrowID
        `);
};

const log = async ({ user_id, action, timestamp }) => {
    const pool = await poolPromise;

    await pool.request()
        .input('UserID', sql.Int, user_id)
        .input('Action', sql.NVarChar, action)
        .input('Timestamp', sql.DateTime, timestamp || new Date())
        .query(`
            INSERT INTO dbo.SYSTEM_LOG (user_id, action, timestamp)
            VALUES (@UserID, @Action, @Timestamp)
        `);
};

const getLogs = async () => {
    const pool = await poolPromise;

    const result = await pool.request()
        .query(`
            SELECT * FROM dbo.SYSTEM_LOG
        `);

    return result.recordset;
};

module.exports = {
    logBorrow,
    getBorrowLogs,
    updateBorrow,
    deleteBorrow,
    log,
    getLogs
};
