const express = require('express');
const router = express.Router();
const userController = require('../controllers/UsersController');
const { verifyToken, isUser } = require('../middlewares/authMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.get('/books', userController.getBooks);
router.get('/books/:id', userController.getBookById);

router.get('/cart', verifyToken, isUser, userController.getCart);
router.post('/cart', verifyToken, isUser, userController.addToCart);
router.put('/cart', verifyToken, isUser, userController.updateCartQuantity);
router.delete('/cart/:bookId', verifyToken, isUser, userController.removeFromCart);

router.post('/checkout', verifyToken, isUser, userController.checkout);
router.get('/orders', verifyToken, isUser, userController.getMyOrders);

module.exports = router;
