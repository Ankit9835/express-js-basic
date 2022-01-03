const Product = require("../models/product");

const products = [];


exports.allProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list',  {prods:products,
            pageTitle: 'Shop',
            path: '/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCss: true,
            default: false
        });
    });
    //res.sendFile(path.join(mainDir, 'views', 'shop.html'));
   
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log(prodId);
    res.redirect('/');
    //res.sendFile(path.join(mainDir, 'views', 'shop.html'));
   
};

exports.getIndex = (req,res,next) => {
    Product.fetchAll(products => {
        res.render('shop/index',  {prods:products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCss: true,
            default: false
        });
    });
};

exports.getCart = (req,res,next) => {
    res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path : '/cart',
    });
};

exports.getOrders = (req,res,next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Order',
        path : '/orders',
    });
};

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout Page',
        path : '/checkout',
    });
};