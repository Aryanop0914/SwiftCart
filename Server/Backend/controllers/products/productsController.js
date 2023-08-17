const product = require("../../Schemas/productSchema");
const cart = require("../../Schemas/cartSchema");
const shipping = require("../../Schemas/shippingSchema");

const fetchproduct = {
  async fetchallproductcategory(req, res, next) {
    const { category } = req.body;
    if (category == "allproducts") {
      const productcategory = await product.find();
      res.json(productcategory);
    } else {
      const productcategory = await product.find({
        product_category: category,
      });
      res.json(productcategory);
    }
  },
  async fetchoneproductid(req, res, next) {
    const { productid, email } = req.body;
    const singleproduct = await product.findOne({ _id: productid });
    const presentin = await cart.findOne({
      email: email,
      "products.productid": productid,
    });
    if (presentin === null) {
      var present = 0;
    }
    const objectpass = {
      singleproduct,
      present,
    };
    res.json(objectpass);
  },
  async addtocart(req, res, next) {
    const { email, productid } = req.body;
    const user = await cart.findOne({ email: email });
    if (!user) {
      const added = await cart.create({
        email: email,
        products: { productid: productid, productQuantity: 1 },
      });
      res.send(added);
    } else {
      const added = await cart.findOneAndUpdate(
        { email: email },
        { $push: { products: { productid: productid, productQuantity: 1 } } }
      );
      res.send(added);
    }
  },
  async removefromcart(req, res, next) {
    const { email, productid } = req.body;
    const removed = await cart.updateOne(
      { email: email },
      { $pull: { products: { productid: productid } } }
    );
    res.send(removed);
  },
  async fetchproductfromcart(req, res, next) {
    const { email } = req.body;
    const present = await shipping.findOne({
      email: email,
    });
    const cartfound = await cart.findOne({ email: email });
    var total = 0;
    const cartproducts = [];
    if (cartfound !== null) {
      for (const productid of cartfound.products) {
        const id = productid.productid;
        const products = await product.findOne({ _id: id });
        total = total + products.product_price * productid.productQuantity;
        const productone = {
          products,
          productQuantity: productid.productQuantity,
        };
        cartproducts.push(productone);
      }
    } else {
      return res.send({ msg: "Your Cart is empty" });
    }
    if (present !== null) {
      const productobj = {
        cartproducts,
        total,
        present: "present",
      };
      res.send(productobj);
    } else {
      const productobj = {
        cartproducts,
        total,
        present: "notpresent",
      };
      res.send(productobj);
    }
  },
};

module.exports = fetchproduct;
