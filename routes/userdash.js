const express = require('express');
const {body, validationResult } = require('express-validator');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Product = require("../models/Product")
const Pizza = require("../models/Pizza")
const Cart = require("../models/Cart")
const Customcart = require("../models/Customcart")
const Order = require("../models/Order")


//Route 1 : get all the products using: GET "api/userdash/fetch" . login required
router.get("/fetch", fetchuser, async (req, res) => {
    try {
      const product = await Product.find().select("-number");;
      res.json(product);
    } catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured")
  } 
  });

//Route 2 : get all the pizza using: GET "api/userdash/fetchpizza" . login required
router.get("/fetchpizza", fetchuser, async (req, res) => {
  try {
    const pizza = await Pizza.find().select("-number");;
    res.json(pizza);
  } catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured")
} 
});

// route - 3
router.post(
  "/addcart",
  fetchuser,
  async (req, res) => {
    let success = false;
          try {
        const { name, image,price,userid} = req.body;
        const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors: errors.array()});
    }
    const cart = new Cart({
      name, image,price,userid
    })
    const savedProduct = await cart.save();
    success = true;
    res.json({success,savedProduct});

    } catch(error){
        console.error(error.message);
        res.status(500).json({success,error:"Some error occured"})
    }
  }
);


router.get("/fetchcart", fetchuser, async (req, res) => {
  try {
    let userid =req.user.id;
    const cart = await Cart.find({userid});
    res.json(cart);
  } catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured")
} 
});


router.delete(
  "/deletecart/:id",
  fetchuser,
  async (req, res) => {
      try {
      let cart = await Cart.findById(req.params.id);
      if(!cart){return res.status(404).send("Not Found")};
      
    cart = await Cart.findByIdAndDelete(req.params.id);
      res.json({"Success": "Product has been removed", cart : cart});
  } catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured")
  } 
  }
);


router.post(
  "/addcustomcart",
  fetchuser,
  async (req, res) => {
    let success = false;
          try {
        const {pizzabase,pizzasauce,pizzacheese,userid} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
          return res.status(400).json({success,errors: errors.array()});
        }
        let product1 = await Product.findOne({"_id": pizzabase });
        let product2 = await Product.findOne({"_id": pizzasauce });
        let product3 = await Product.findOne({"_id": pizzacheese });
        const name = [`${product1.name}`,`${product2.name}`,`${product3.name}`];
        const price = parseInt(product1.price + product2.price + product3.price);
    const customcart = new Customcart({
      name,price,userid
    })
    const savedProduct = await customcart.save();
    success = true;
    res.json({success,savedProduct});

    } catch(error){
        console.error(error.message);
        res.status(500).json({success,error:"Some error occured"})
    }
  }
);

router.get("/fetchcustomcart", fetchuser, async (req, res) => {
  try {
    let userid =req.user.id;
    const customcart = await Customcart.find({userid});
    res.json(customcart);
  } catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured")
} 
});

router.delete(
  "/deletecustomcart/:id",
  fetchuser,
  async (req, res) => {
      try {
      let customcart = await Customcart.findById(req.params.id);
      if(!customcart){return res.status(404).send("Not Found")};
      
    customcart = await Customcart.findByIdAndDelete(req.params.id);
      res.json({"Success": "Product has been removed", customcart : customcart});
  } catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured")
  } 
  }
);


router.post(
  "/addorder",
  fetchuser,
  async (req, res) => {
    let success = false;
          try {
            const {name,price,userid} = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()){
              return res.status(400).json({success,errors: errors.array()});
            }
            const nami = [`${name}`,];
    const order = new Order({
      "name" : nami,
      "category":"normal pizza",
      "status": "Order placed",
      "price": price,
      "userid": userid
    })
    const savedProduct = await order.save();
    success = true;
    res.json({success,savedProduct});

    } catch(error){
        console.error(error.message);
        res.status(500).json({success,error:"Some error occured"})
    }
  }
);

router.post(
  "/addcustomorder",
  fetchuser,
  async (req, res) => {
    let success = false;
          try {
            const {name,price,userid} = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()){
              return res.status(400).json({success,errors: errors.array()});
            }
            const nami = [`${name[0]}`,`${name[1]}`,`${name[2]}`];
    const order = new Order({
      "name" : nami,
      "category":"custom pizza",
      "status": "Order placed",
      "price": price,
      "userid": userid
    })
    const savedProduct = await order.save();
    success = true;
    res.json({success,savedProduct});

    } catch(error){
        console.error(error.message);
        res.status(500).json({success,error:"Some error occured"})
    }
  }
);


router.get("/fetchorder", fetchuser, async (req, res) => {
  try {
    let userid =req.user.id;
    const order = await Order.find({userid});
    res.json(order);
  } catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured")
} 
});


router.delete(
  "/cancelOrder/:id",
  fetchuser,
  async (req, res) => {
      try {
      let order = await Order.findById(req.params.id);
      if(!order){return res.status(404).send("Not Found")};
      
    order = await Order.findByIdAndDelete(req.params.id);
      res.json({"Success": "Order has been cancelled successfully", order : order});
  } catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured")
  } 
  }
);

module.exports = router ;
