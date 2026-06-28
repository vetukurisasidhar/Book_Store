const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/SellerControllers');
const { verifyToken, isSeller } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.post('/signup', sellerController.signup);
router.post('/login', sellerController.login);

router.post('/books', verifyToken, isSeller, upload.single('image'), sellerController.addBook);
router.get('/books', verifyToken, isSeller, sellerController.getMyBooks);
router.put('/books/:id', verifyToken, isSeller, upload.single('image'), sellerController.updateBook);
router.delete('/books/:id', verifyToken, isSeller, sellerController.deleteBook);

router.get('/orders', verifyToken, isSeller, sellerController.getMyOrders);
router.put('/orders/:id', verifyToken, isSeller, sellerController.updateOrderStatus);
router.get('/stats', verifyToken, isSeller, sellerController.getStats);

module.exports = router;
