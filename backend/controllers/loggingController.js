const loggingModel = require('../models/loggingModel');

const logBorrow = async (req, res) => {
    try {
        await loggingModel.logBorrow(req.body);

        return res.status(200).json({
            success: true,
            message: 'Success'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const getBorrowLogs = async (req, res) => {
    try {
        const { user_id } = req.query;
        const data = await loggingModel.getBorrowLogs(user_id);

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

const editBorrow = async (req, res) => {
    try {
        await loggingModel.updateBorrow(req.body);

        return res.status(200).json({
            success: true,
            message: 'Success'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const deleteBorrow = async (req, res) => {
    try {
        const { borrow_id } = req.body;
        await loggingModel.deleteBorrow(borrow_id);

        return res.status(200).json({
            success: true,
            message: 'Success'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const log = async (req, res) => {
    try {
        await loggingModel.log(req.body);

        return res.status(200).json({
            success: true,
            message: 'Success'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const getLogs = async (req, res) => {
    try {
        const data = await loggingModel.getLogs();

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

module.exports = {
    logBorrow,
    getBorrowLogs,
    editBorrow,
    deleteBorrow,
    log,
    getLogs
};
