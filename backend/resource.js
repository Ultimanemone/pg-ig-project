const { sql, poolPromise } = require('../config');
const express = require('express');
const router = express.Router();

const addResource = async (req, res) => {
    try {
        const {
            res_id, title, author, description, availability
        } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input('ResID', sql.Int, res_id)
            .input('Title', sql.NVarChar, title)
            .input('Author', sql.NVarChar, author)
            .input('Description', sql.NVarChar, description)
            .input('Availability', sql.Bit, availability)
            .query(`
                INSERT INTO dbo.RESOURCE (res_id, title, author, description, availability)
                VALUES (@ResID, @Title, @Author, @Description, @Availability)
            `);

        return res.status(200).json({
            success: true,
            message: 'Resource added successfully'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const getResources = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .query(`
                SELECT * FROM dbo.RESOURCE
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

const updateResource = async (req, res) => {
    try {
        const {
            res_id, title, author, description, availability
        } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input('ResID', sql.Int, res_id)
            .input('Title', sql.NVarChar, title)
            .input('Author', sql.NVarChar, author)
            .input('Description', sql.NVarChar, description)
            .input('Availability', sql.Bit, availability)
            .query(`
                UPDATE dbo.RESOURCE
                SET title = @Title, author = @Author, description = @Description, availability = @Availability
                WHERE res_id = @ResID
            `);

        return res.status(200).json({
            success: true,
            message: 'Resource updated successfully'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const deleteResource = async (req, res) => {
    try {
        const { res_id } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input('ResID', sql.Int, res_id)
            .query(`
                DELETE FROM dbo.RESOURCE
                WHERE res_id = @ResID
            `);

        return res.status(200).json({
            success: true,
            message: 'Resource deleted successfully'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const addCategory = async (req, res) => {
    try {
        const { res_id, category } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input('ResID', sql.Int, res_id)
            .input('Category', sql.NVarChar, category)
            .query(`
                INSERT INTO dbo.RESOURCE_CATEGORY (res_id, category)
                VALUES (@ResID, @Category)
            `);

        return res.status(200).json({
            success: true,
            message: 'Category added successfully'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const getCategories = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .query(`
                SELECT * FROM dbo.RESOURCE_CATEGORY
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

const updateCategory = async (req, res) => {
    try {
        const { res_id, category } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input('ResID', sql.Int, res_id)
            .input('Category', sql.NVarChar, category)
            .query(`
                UPDATE dbo.RESOURCE_CATEGORY
                SET category = @Category
                WHERE res_id = @ResID
            `);

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { res_id } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input('ResID', sql.Int, res_id)
            .query(`
                DELETE FROM dbo.RESOURCE_CATEGORY
                WHERE res_id = @ResID
            `);

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const addBookmark = async (req, res) => {
    try {
        const { user_id, res_id, bm_id } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input('UserID', sql.Int, user_id)
            .input('ResID', sql.Int, res_id)
            .input('BMID', sql.Int, bm_id)
            .query(`
                INSERT INTO dbo.BOOKMARK (user_id, res_id, bm_id)
                VALUES (@UserID, @ResID, @BMID)
            `);

        return res.status(200).json({
            success: true,
            message: 'Bookmark added successfully'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const getBookmarks = async (req, res) => {
    try {
        const { user_id } = req.query;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('UserID', sql.Int, user_id)
            .query(`
                SELECT * FROM dbo.BOOKMARK WHERE user_id = @UserID
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

const deleteBookmark = async (req, res) => {
    try {
        const { bm_id } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input('BMID', sql.Int, bm_id)
            .query(`
                DELETE FROM dbo.BOOKMARK
                WHERE bm_id = @BMID
            `);

        return res.status(200).json({
            success: true,
            message: 'Bookmark deleted successfully'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

router.post('/add', addResource);
router.get('/', getResources);
router.put('/update', updateResource);
router.delete('/delete', deleteResource);
router.post('/category/add', addCategory);
router.get('/category', getCategories);
router.put('/category/update', updateCategory);
router.delete('/category/delete', deleteCategory);
router.post('/bookmark/add', addBookmark);
router.get('/bookmark', getBookmarks);
router.delete('/bookmark/delete', deleteBookmark);

module.exports = router;