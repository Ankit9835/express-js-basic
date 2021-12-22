const express = require('express');
const path = require('path');
const mainDir = require('../util/path');
const router = express.Router();

const products = [];

router.get('/add-product',(req, res, next) => {
    console.log('In the middleware!');
    res.render('add-product', {pageTitle:'Add Product', path: '/admin/add-product', formsCSS: true, productCSS: true, activeAddProduct: true});
});

router.post('/product', (req, res, next) => {
    products.push({title:req.body.title});
    console.log('test');
    res.redirect('/');
});

exports.routes = router;
exports.products = products;