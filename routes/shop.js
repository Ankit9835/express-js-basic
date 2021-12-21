const express = require('express');
const path = require('path');
const mainDir = require('../util/path');
const adminData = require('./admin');
const router = express.Router();


router.get('/',(req, res, next) => {
    const products = adminData.products;
    //res.sendFile(path.join(mainDir, 'views', 'shop.html'));
    res.render('shop', {prods:products, docTitle: 'Shop'});
});

module.exports = router;