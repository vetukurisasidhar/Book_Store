const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminControllers');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/signup', adminController.signup);
router.post('/login', adminController.login);

router.get('/sellers', verifyToken, isAdmin, adminController.getAllSellers);
router.put('/sellers/:id/approve', verifyToken, isAdmin, adminController.approveSeller);
router.put('/sellers/:id/block', verifyToken, isAdmin, adminController.toggleBlockSeller);

router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);
router.get('/books', verifyToken, isAdmin, adminController.getAllBooks);
router.delete('/books/:id', verifyToken, isAdmin, adminController.deleteBook);
router.get('/stats', verifyToken, isAdmin, adminController.getStats);

module.exports = router;
