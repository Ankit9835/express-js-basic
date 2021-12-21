const express = require('express');
const path = require('path');
const mainDir = require('../util/path');
const router = express.Router();

router.get('/add-product',(req, res, next) => {
    console.log('In the middleware!');
    res.sendFile(path.join(mainDir, 'views', 'add-product.html'));
});

router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router; 