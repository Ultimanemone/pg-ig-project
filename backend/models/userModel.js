const { sql, poolPromise } = require('../../config');

const login = async ({ username, password }) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('Username', sql.NVarChar, username)
        .input('Password', sql.NVarChar, password)
        .query(`
            SELECT user_id, role, nickname, email
            FROM dbo.[USER] 
            WHERE (nickname = @Username OR email = @Username) AND [password] = @Password
        `);

    return result.recordset[0] || null;
};

const getAllAccounts = async () => {
    const pool = await poolPromise;

    const result = await pool.request()
        .query(`
            SELECT user_id, nickname, email, role, creationDate FROM dbo.[USER] ORDER BY user_id
        `);

    return result.recordset;
};

const getAccountByUsernameOrEmail = async (username) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('Username', sql.NVarChar, username)
        .query(`
            SELECT user_id, nickname, email, [password], role
            FROM dbo.[USER]
            WHERE nickname = @Username OR email = @Username
        `);

    return result.recordset[0] || null;
};

const getAccountById = async (userId) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .query(`
            SELECT user_id, nickname, email, password, role FROM dbo.[USER] WHERE user_id = @UserID
        `);

    return result.recordset[0] || null;
};

const createAccount = async ({ nickname, email, password, role }) => {
    const pool = await poolPromise;

    await pool.request()
        .input('Nickname', sql.NVarChar, nickname)
        .input('Email', sql.NVarChar, email)
        .input('Password', sql.NVarChar, password)
        .input('Role', sql.NVarChar, role)
        .query(`
            INSERT INTO dbo.[USER] (nickname, email, password, role) VALUES (@Nickname, @Email, @Password, @Role)
        `);
};

const updateAccount = async ({ user_id, nickname, email, password, role }) => {
    const pool = await poolPromise;

    await pool.request()
        .input('UserID', sql.Int, user_id)
        .input('Nickname', sql.NVarChar, nickname)
        .input('Email', sql.NVarChar, email)
        .input('Password', sql.NVarChar, password)
        .input('Role', sql.NVarChar, role)
        .query(`
            UPDATE dbo.[USER] SET nickname = @Nickname, email = @Email, password = @Password, role = @Role WHERE user_id = @UserID
        `);
};

const deleteAccount = async (userId) => {
    const pool = await poolPromise;

    await pool.request()
        .input('UserID', sql.Int, userId)
        .query(`
            DELETE FROM dbo.[USER] WHERE user_id = @UserID
        `);
};

const updateUserPreference = async ({ user_id, category, countChange, lastread }) => {
    const pool = await poolPromise;

    await pool.request()
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
                INSERT INTO dbo.USERPREFERENCE (user_id, category, count, lastread) VALUES (@UserID, @Category, @CountChange, @LastRead)
            END
        `);
};

module.exports = {
    login,
    getAllAccounts,
    getAccountByUsernameOrEmail,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
    updateUserPreference
};
