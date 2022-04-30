const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
        console.log(cart);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        console.log(updatedProduct);
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice){
    fs.readFile(p, (err, fileContent) => {
      if(err){
        return;
      }
      const updatedProducts = { ...JSON.parse(fileContent) };
      const product = updatedProducts.products.find(prod => prod.id === id);
      const productQty = product.qty;
      updatedProducts.products = updatedProducts.products.filter(prod => prod.id !== id);
      updatedProducts.totalPrice = updatedProducts.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        console.log(err);
      });
    });
  }

  static getCart(cb){
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if(err){
        cb(null);
      } else {
        cb(cart);
      }
    })
  }
};
