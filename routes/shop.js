const express = require('express');
const path = require('path');
const mainDir = require('../util/path');
const router = express.Router();

router.get('/',(req, res, next) => {
    console.log('In another middleware!');
    res.sendFile(path.join(mainDir, 'views', 'shop.html'));
});

module.exports = router;