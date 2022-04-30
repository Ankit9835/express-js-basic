const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/auth-check');

const router = express.Router();

 router.get('/', shopController.getIndex);

 router.get('/products', shopController.getProducts);

 router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

 router.post('/cart', shopController.postCart);

 router.post('/cart-delete-item', shopController.postCartDeleteProduct);

 router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);

router.get('/orders', shopController.getOrders);
//router.post('/create-order', shopController.postOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

  // router.get('/mail', shopController.getEmail);
  // router.post('/text-mail', shopController.postEmail);

// router.get('/checkout', shopController.getCheckout);

module.exports = router;
