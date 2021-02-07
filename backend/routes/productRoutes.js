const express = require('express');

const productController = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const Product = require('../models/productModel');

const router = express.Router();


router.get('/', productController.getProducts);

router.post('/', [protect, isAdmin], productController.createProduct);

router.post('/:id/reviews', protect, productController.createProductReview);

router.get('/top', productController.getTopProducts);

router.get('/:id', productController.getProductById);

router.delete('/:id', [protect, isAdmin], productController.deleteProduct);

router.put('/:id', [protect, isAdmin], productController.updateProduct);



module.exports = router;