


const db = require('../util/database');
const Cart = require('./cart');



module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      'INSERT INTO PRODUCTS (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static fetchAll() {
    return db.execute('SELECT * FROM PRODUCTS');
  }

  static delete(id){
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(p => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts),err => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
      //cb(product);
    });
  }

  static findById(id) {
    return db.execute('SELECT * FROM PRODUCTS WHERE PRODUCTS.id = ?', [id]);
  }
};
