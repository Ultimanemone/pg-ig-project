const express = require('express');
const router = express.Router();
const loggingController = require('../controllers/loggingController');

router.post('/log/borrow', loggingController.logBorrow);
router.get('/log/borrow', loggingController.getBorrowLogs);
router.put('/log/borrow', loggingController.editBorrow);
router.delete('/log/borrow', loggingController.deleteBorrow);
router.post('/log', loggingController.log);
router.get('/log', loggingController.getLogs);

module.exports = router;
