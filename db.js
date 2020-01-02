const fs = require("fs");

const readFile = new Promise((resolve, reject) => {
  try {
    let file = fs.readFileSync("./products.json");
    file = JSON.parse(file);
    resolve(file);
  } catch (err) {
    reject(err);
  }
});
const writeFile = products => {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync("./products.json", JSON.stringify(products, null, 4));
      resolve(products[products.length - 1]);
    } catch (err) {
      reject(err);
    }
  });
};
class ProductDB {
  constructor() {
    readFile
      .then(file => {
        this.products = [...file];
        // console.log(this.products);
      })
      .catch(err => console.log(err));
  }
  getAllProducts() {
    return this.products;
  }
  getProductById(prodId) {
    return this.products.find(prod => prod.id === prodId);
  }
  addProduct(product) {
    this.products.push(product);
    // console.log(`Going to write ${JSON.stringify(this.products)} to file`);
    this.syncProducts();
    return product;
  }
  syncProducts() {
    writeFile(this.products)
      .then(product => {
        console.log(`Database product synced`);
      })
      .catch(err => console.log(err));
  }
  deleteProduct(prodId) {
    let product = this.products.find(prod => prodId === prod.id);
    if (!product) throw new Error("Could not find product in database");
    this.products = this.products.filter(prod => prod.id !== prodId);
    this.syncProducts();
    return product;
  }
  editProduct(product) {
    this.products = this.products.map(prod => {
      if (prod.id === product.id) {
        prod = product;
      }
      return prod;
    });
    this.syncProducts();
    console.log(`Product #${product.id} updated`);
    return product;
  }
}

module.exports = ProductDB;
