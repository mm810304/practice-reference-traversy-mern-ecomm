const express = require('express');

const orderController = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, orderController.addOrderItems);
router.get('/', [protect, isAdmin], orderController.getOrders);

router.get('/myorders', protect, orderController.getMyOrders);

router.put('/:id/pay', protect, orderController.updateOrderToPaid);

router.put('/:id/deliver', [protect, isAdmin], orderController.updateOrderToDelivered);

router.get('/:id', protect, orderController.getOrderById);

module.exports = router;