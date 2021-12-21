const express = require('express');
const path = require('path');
const mainDir = require('../util/path');
const router = express.Router();

const products = [];

router.get('/add-product',(req, res, next) => {
    console.log('In the middleware!');
    res.render('add-product', {docTitle:'Add Product'});
});

router.post('/product', (req, res, next) => {
    products.push({title:req.body.title});
    console.log('test');
    res.redirect('/');
});

exports.routes = router;
exports.products = products;