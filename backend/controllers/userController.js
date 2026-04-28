const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// JWT secret key - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_in_production';
const JWT_EXPIRY = '24h';

const login = async (req, res) => {
    try {
        const user = await userModel.login(req.body);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Incorrect username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                username: user.nickname,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        return res.status(200).json({
            success: true,
            message: 'Success',
            token: token,
            role: user.role,
            user_id: user.user_id,
            nickname: user.nickname,
            email: user.email
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const getAccount = async (req, res) => {
    try {
        const { user_id, username } = req.query;

        if (!user_id && !username) {
            const users = await userModel.getAllAccounts();
            return res.status(200).json({
                success: true,
                message: 'Success',
                data: users
            });
        }

        const user = user_id
            ? await userModel.getAccountById(user_id)
            : await userModel.getAccountByUsernameOrEmail(username);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Success',
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};

const createAccount = async (req, res) => {
    try {
        await userModel.createAccount(req.body);

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

const editAccount = async (req, res) => {
    try {
        await userModel.updateAccount(req.body);

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

const deleteAccount = async (req, res) => {
    try {
        const { user_id } = req.body;
        await userModel.deleteAccount(user_id);

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

const updateUserPref = async (req, res) => {
    try {
        await userModel.updateUserPreference(req.body);

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

module.exports = {
    login,
    getAccount,
    createAccount,
    editAccount,
    deleteAccount,
    updateUserPref
};
