const fs = require('fs');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const PDFDocument = require('pdfkit');
const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

//const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.find().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getIndex = (req, res, next) => {
  const page = req.query.page;
  let totalItems;


  Product.find()
  .count()
  .then(numProduct => {
    totalItems = numProduct;
    return Product.find()
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE)
  }).then(products => {
    console.log(products);
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
};

exports.getCart = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    console.log(user.cart.items);
    const cart = user.cart.items;
    res.render('shop/cart', {
             path: '/cart',
             pageTitle: 'Your Cart',
             products: cart,
           });
  })
  // req.user
  //   .getCart()
  //   .then(products => {
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: products
  //     });
  //   })
  //   .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => {
   return req.user.addToCart(product)
  }).then(result => {
    console.log(result);
    res.redirect('/cart');
  })

  
};

exports.postCartDeleteProduct = (req,res,next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId).then(result => {
    res.redirect('/cart');
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
};

exports.getCheckout = (req,res,next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    console.log(user.cart.items);
    const cart = user.cart.items;
    let total = 0;
    cart.forEach(p => {
      total += p.quantity * p.productId.price;
    });

    return stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map(p => {
        return {
          name: p.productId.title,
          description: p.productId.description,
          amount: p.productId.price * 100,
          currency: 'inr',
          quantity: p.quantity
        };
      }),
      success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
      cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
    });
  })
  .then(session => {
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Your Checkout',
      products: cart,
      totalSum: total
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
 
}

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getOrders = (req, res, next) => {
 
    //console.log(orders);
   
  Order.find( { 'user.userId' : req.user._id} )
  .then(orders => {
    console.log(orders);
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
  
};

exports.postOrders = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items.map(i => {
      return { quantity: i.quantity, product: {  ...i.productId._doc  } };
    });
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user
      },
      products: products
    });
    return order.save();
  })
  .then((result) => {
    return req.user.clearCart();
  })
  .then(() => {
    res.redirect('/orders');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
   });
};


exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {

      if(!order){
        return next(new Error('No Order Found'));
      }

      // if(order.user.userId.toString() !== req.user._id.toString()){
      //   return next(new Error('UnAuthorized'));
      // }
      
      
      console.log(order);
      //console.log(order.user.userId);
      //console.log(req.user._id)
       
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline:true
      });

      pdfDoc.text('.............................');
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price
        pdfDoc.text(prod.product.title
           + '-' + 
           prod.quantity
            + '*' + '$' +
           prod.product.price
        )
      });
      pdfDoc.text('Total Price' + totalPrice);
      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader(
      //     'Content-Disposition',
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader(
      //   'Content-Disposition',
      //   'inline; filename="' + invoiceName + '"'
      // );
      // file.pipe(res);
    })
    .catch(err => next(err));
};

// exports.postEmail = (req, res, next) => {
//   let nodemailer = require('nodemailer');

  
//   var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'ankit@pitangent.com',
//       pass: '6202017915Aa'
//     }
//   });
  
//   var mailOptions = {
//     from: 'ankit@pitangent.com',
//     to: 'ankit40611@gmail.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   };
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// };

// exports.getEmail = (req, res, next) => {
//   res.render('shop/email', {
//     path: '/orders',
//     pageTitle: 'Your Orders',
//   });
// };
