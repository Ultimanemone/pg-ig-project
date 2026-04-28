const resourceModel = require('../models/resourceModel');

const addResource = async (req, res) => {
    try {
        const res_id = await resourceModel.addResource(req.body);

        return res.status(200).json({
            success: true,
            message: 'Resource added successfully',
            res_id
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const getResources = async (req, res) => {
    try {
        const data = await resourceModel.getResources();

        return res.status(200).json({
            success: true,
            message: 'Success',
            data
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const updateResource = async (req, res) => {
    try {
        await resourceModel.updateResource(req.body);

        return res.status(200).json({
            success: true,
            message: 'Resource updated successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const deleteResource = async (req, res) => {
    try {
        const { res_id } = req.body;
        await resourceModel.deleteResource(res_id);

        return res.status(200).json({
            success: true,
            message: 'Resource deleted successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const addCategory = async (req, res) => {
    try {
        await resourceModel.addCategory(req.body);

        return res.status(200).json({
            success: true,
            message: 'Category added successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const data = await resourceModel.getCategories();

        return res.status(200).json({
            success: true,
            message: 'Success',
            data
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        await resourceModel.updateCategory(req.body);

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { res_id } = req.body;
        await resourceModel.deleteCategory(res_id);

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const addBookmark = async (req, res) => {
    try {
        await resourceModel.addBookmark(req.body);

        return res.status(200).json({
            success: true,
            message: 'Bookmark added successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const getBookmarks = async (req, res) => {
    try {
        const { user_id } = req.query;
        const data = await resourceModel.getBookmarks(user_id);

        return res.status(200).json({
            success: true,
            message: 'Success',
            data
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const deleteBookmark = async (req, res) => {
    try {
        const { bm_id } = req.body;
        await resourceModel.deleteBookmark(bm_id);

        return res.status(200).json({
            success: true,
            message: 'Bookmark deleted successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const borrowResource = async (req, res) => {
    try {
        await resourceModel.borrowResource(req.body);

        return res.status(200).json({
            success: true,
            message: 'Resource borrowed successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Error', error: error.message });
    }
};

const returnResource = async (req, res) => {
    try {
        await resourceModel.returnResource(req.body);

        return res.status(200).json({
            success: true,
            message: 'Resource returned successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Error', error: error.message });
    }
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
