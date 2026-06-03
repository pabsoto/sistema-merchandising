const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getPremiumProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getProductById 
} = require('../controllers/productController');

const auth = require('../middleware/auth'); 
const isAdmin = require('../middleware/isAdmin'); 
const checkMembership = require('../middleware/membership'); 


router.get('/', getAllProducts);


router.get('/:id', getProductById);


router.get('/premium', auth.verifyToken, checkMembership, getPremiumProducts);


router.post('/', auth.verifyToken, isAdmin, createProduct);
router.put('/:id', auth.verifyToken, isAdmin, updateProduct);
router.delete('/:id', auth.verifyToken, isAdmin, deleteProduct);
router.get('/low-stock', auth.verifyToken, isAdmin, getLowStockProducts);

module.exports = router;
