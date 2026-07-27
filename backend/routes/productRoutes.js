const express = require('express');
const { createProduct, getProducts, deleteProduct } = require('../controllers/productController');
const { validateCreateProduct, validateListQuery, validateIdParam } = require('../middleware/validateProduct');

const router = express.Router();

router.get('/', validateListQuery, getProducts);
router.post('/', validateCreateProduct, createProduct);
router.delete('/:id', validateIdParam, deleteProduct);

module.exports = router;
