const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

router.post('/add', resourceController.addResource);
router.get('/', resourceController.getResources);
router.put('/update', resourceController.updateResource);
router.delete('/delete', resourceController.deleteResource);
router.post('/category/add', resourceController.addCategory);
router.get('/category', resourceController.getCategories);
router.put('/category/update', resourceController.updateCategory);
router.delete('/category/delete', resourceController.deleteCategory);
router.post('/bookmark/add', resourceController.addBookmark);
router.get('/bookmark', resourceController.getBookmarks);
router.delete('/bookmark/delete', resourceController.deleteBookmark);
router.post('/borrow', resourceController.borrowResource);
router.post('/return', resourceController.returnResource);

module.exports = router;
