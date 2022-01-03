const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    console.log('In the middleware!');
    res.render('admin/add-product', {pageTitle:'Add Product',
     path: '/admin/add-product',
     formsCSS: true,
      productCSS: true,
     activeAddProduct: true});
};

exports.postProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(title, imageUrl, price, description);
    product.save();
    console.log('test');
    res.redirect('/');
};

exports.getProduct = (req, res, next) => {
    //console.log('In the middleware!');
    Product.fetchAll(products => {
        res.render('admin/products',  {prods:products,
            pageTitle: 'Shop',
            path: '/admin/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCss: true,
            default: false
        });
    });
};
