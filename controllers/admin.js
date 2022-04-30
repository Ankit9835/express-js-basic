//const Product = require('../models/product');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator/check');
const fileHelper = require('../util/file');
const Product = require("../models/product");


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing: false,
    errorMessage: null,
    validationError: [],
    hasError:false
  });
};

exports.postAddProduct = (req, res, next) => {

  const errors = validationResult(req);

 
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if(!image){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        price:price,
        description:description
      },
      validationError: errors.array()
    });
  }

  const imageUrl = image.path;
  console.log(imageUrl);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        price:price,
        description:description
      },
      validationError: errors.array()
    });
  }



  const product = new Product({ 
                               
                                title:title,
                                price:price,
                                description:description,
                                imageUrl:imageUrl,
                                userId: req.user
                              });
  product.save()
  .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
  }).catch(err => {
      //res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });
};


exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
 
  Product.findById(prodId).then(product => {
  console.log(product);
    if(!product){
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
};

exports.postEditProduct = (req, res, next) => {
 const prodId = req.body.productId;
 const title = req.body.title;
 const image = req.file;
 const price = req.body.price;
 const description = req.body.description;
 Product.findById(prodId).then(product => {
   product.title = title;
   product.price = price;
   product.description = description;
   if(image){
     product.imageUrl = image.path;
   }
   return product.save()
 }).then(result => {
  console.log(result);
  res.redirect('/admin/products');
 }).catch(err => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
 })
 
};

exports.deleteAdminProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(product => {
    if(!product){
      return next(new Error('Product Not Found'));
    }
    fileHelper.deletePath(product.imageUrl);
    return Product.deleteOne({ id:prodId, userId:req.user._id })
  })
  .then(() => {
    //console.log(result);
    //res.redirect('/admin/products');
    res.status(200).json({ message: 'Success!' });
  }).catch(err => {
    res.status(500).json({ message: 'Deleting product failed.' });
  });  
 };

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
  //select('title price description imageUrl -_id')
  .populate('userId', 'name')
  .then(products => {
    console.log(products);
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  }).catch(err => {
    const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  })
};
