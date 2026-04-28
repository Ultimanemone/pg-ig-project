const { sql, poolPromise } = require('../../config');

const addResource = async ({ title, author, description, availability }) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('Title', sql.NVarChar, title)
        .input('Author', sql.NVarChar, author)
        .input('Description', sql.NVarChar, description)
        .input('Availability', sql.NVarChar, availability || 'Available')
        .query(`
            INSERT INTO dbo.RESOURCE (title, author, description, availability)
            OUTPUT INSERTED.res_id
            VALUES (@Title, @Author, @Description, @Availability)
        `);

    return result.recordset[0]?.res_id || null;
};

const getResources = async () => {
    const pool = await poolPromise;

    const result = await pool.request()
        .query(`
            WITH RankedResources AS (
                SELECT r.res_id, r.title, r.author, r.description, r.availability,
                       ROW_NUMBER() OVER (PARTITION BY r.title, r.author ORDER BY r.res_id) AS rn
                FROM dbo.RESOURCE r
            )
            SELECT rr.res_id, rr.title, rr.author, rr.description, rr.availability, rc.category
            FROM RankedResources rr
            LEFT JOIN dbo.RESOURCECATEGORY rc ON rc.res_id = rr.res_id
            WHERE rr.rn = 1
            ORDER BY rr.res_id
        `);

    return result.recordset;
};

const updateResource = async ({ res_id, title, author, description, availability }) => {
    const pool = await poolPromise;

    await pool.request()
        .input('ResID', sql.Int, res_id)
        .input('Title', sql.NVarChar, title)
        .input('Author', sql.NVarChar, author)
        .input('Description', sql.NVarChar, description)
        .input('Availability', sql.NVarChar, availability)
        .query(`
            UPDATE dbo.RESOURCE
            SET title = @Title, author = @Author, description = @Description, availability = @Availability
            WHERE res_id = @ResID
        `);
};

const deleteResource = async (resId) => {
    const pool = await poolPromise;

    await pool.request()
        .input('ResID', sql.Int, resId)
        .query(`
            DELETE FROM dbo.RESOURCE
            WHERE res_id = @ResID
        `);
};

const addCategory = async ({ res_id, category }) => {
    const pool = await poolPromise;

    await pool.request()
        .input('ResID', sql.Int, res_id)
        .input('Category', sql.NVarChar, category)
        .query(`
            INSERT INTO dbo.RESOURCECATEGORY (res_id, category)
            VALUES (@ResID, @Category)
        `);
};

const getCategories = async () => {
    const pool = await poolPromise;

    const result = await pool.request()
        .query(`
            SELECT * FROM dbo.RESOURCECATEGORY
        `);

    return result.recordset;
};

const updateCategory = async ({ res_id, category }) => {
    const pool = await poolPromise;

    await pool.request()
        .input('ResID', sql.Int, res_id)
        .input('Category', sql.NVarChar, category)
        .query(`
            UPDATE dbo.RESOURCECATEGORY
            SET category = @Category
            WHERE res_id = @ResID
        `);
};

const deleteCategory = async (resId) => {
    const pool = await poolPromise;

    await pool.request()
        .input('ResID', sql.Int, resId)
        .query(`
            DELETE FROM dbo.RESOURCECATEGORY
            WHERE res_id = @ResID
        `);
};

const addBookmark = async ({ user_id, res_id }) => {
    const pool = await poolPromise;

    await pool.request()
        .input('UserID', sql.Int, user_id)
        .input('ResID', sql.Int, res_id)
        .query(`
            INSERT INTO dbo.BOOKMARK (user_id, res_id)
            VALUES (@UserID, @ResID)
        `);
};

const getBookmarks = async (userId) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .query(`
            SELECT b.bm_id, b.user_id, b.res_id, r.title, r.author, r.availability
            FROM dbo.BOOKMARK b
            INNER JOIN dbo.RESOURCE r ON r.res_id = b.res_id
            WHERE b.user_id = @UserID
            ORDER BY b.bm_id
        `);

    return result.recordset;
};

const deleteBookmark = async (bmId) => {
    const pool = await poolPromise;

    await pool.request()
        .input('BMID', sql.Int, bmId)
        .query(`
            DELETE FROM dbo.BOOKMARK
            WHERE bm_id = @BMID
        `);
};

const borrowResource = async ({ user_id, res_id }) => {
    const pool = await poolPromise;

    const availabilityResult = await pool.request()
        .input('ResID', sql.Int, res_id)
        .query(`
            SELECT availability, title
            FROM dbo.RESOURCE
            WHERE res_id = @ResID
        `);

    if (!availabilityResult.recordset.length) {
        throw new Error('Resource not found');
    }

    const resource = availabilityResult.recordset[0];
    if (resource.availability !== 'Available') {
        throw new Error('Resource is currently unavailable');
    }

    await pool.request()
        .input('UserID', sql.Int, user_id)
        .input('ResID', sql.Int, res_id)
        .input('Status', sql.NVarChar, 'Borrowed')
        .query(`
            INSERT INTO dbo.BORROW_RECORD (user_id, res_id, borrow_date, return_date, status)
            VALUES (@UserID, @ResID, GETDATE(), DATEADD(DAY, 7, GETDATE()), @Status)
        `);

    await pool.request()
        .input('ResID', sql.Int, res_id)
        .query(`
            UPDATE dbo.RESOURCE
            SET availability = 'Unavailable'
            WHERE res_id = @ResID
        `);

    await pool.request()
        .input('UserID', sql.Int, user_id)
        .input('Action', sql.NVarChar, `Borrowed ${resource.title}`)
        .query(`
            INSERT INTO dbo.SYSTEM_LOG (user_id, action, [timestamp])
            VALUES (@UserID, @Action, GETDATE())
        `);
};

const returnResource = async ({ user_id, res_id }) => {
    const pool = await poolPromise;

    const borrowResult = await pool.request()
        .input('UserID', sql.Int, user_id)
        .input('ResID', sql.Int, res_id)
        .query(`
            SELECT TOP 1 borrow_id
            FROM dbo.BORROW_RECORD
            WHERE user_id = @UserID AND res_id = @ResID AND status = 'Borrowed'
            ORDER BY borrow_date DESC
        `);

    if (!borrowResult.recordset.length) {
        throw new Error('No active borrow record found for this user and resource');
    }

    await pool.request()
        .input('BorrowID', sql.Int, borrowResult.recordset[0].borrow_id)
        .query(`
            UPDATE dbo.BORROW_RECORD
            SET status = 'Returned',
                return_date = GETDATE()
            WHERE borrow_id = @BorrowID
        `);

    await pool.request()
        .input('ResID', sql.Int, res_id)
        .query(`
            UPDATE dbo.RESOURCE
            SET availability = 'Available'
            WHERE res_id = @ResID
        `);

    const resourceResult = await pool.request()
        .input('ResID', sql.Int, res_id)
        .query(`
            SELECT title
            FROM dbo.RESOURCE
            WHERE res_id = @ResID
        `);

    const title = resourceResult.recordset[0]?.title || `resource #${res_id}`;

    await pool.request()
        .input('UserID', sql.Int, user_id)
        .input('Action', sql.NVarChar, `Returned ${title}`)
        .query(`
            INSERT INTO dbo.SYSTEM_LOG (user_id, action, [timestamp])
            VALUES (@UserID, @Action, GETDATE())
        `);
};

module.exports = {
    addResource,
    getResources,
    updateResource,
    deleteResource,
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    addBookmark,
    getBookmarks,
    deleteBookmark,
    borrowResource,
    returnResource
};
