const express = require('express');
const path = require('path');
const adminController = require('../controllers/admin');
const mainDir = require('../util/path');
const router = express.Router();

const products = [];

router.get('/add-product', adminController.getAddProduct);
router.get('/product', adminController.getProduct);

router.post('/product', adminController.postProduct);

exports.routes = router;
