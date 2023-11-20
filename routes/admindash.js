const express = require('express');
const {body, validationResult } = require('express-validator');
const router = express.Router();
const fetchadmin = require('../middleware/fetchAdmin');
const Product = require("../models/Product")
const Pizza = require("../models/Pizza")
const Order = require("../models/Order")
const User = require('../models/User');

//Route 1 : get all the products using: GET "api/admindash/fetch" . login required
router.get("/fetch", fetchadmin, async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured")
  } 
  });


//Route 2   : add a new product using: POST "api/admindash/addproduct" . login required
router.post(
    "/addproduct",
    fetchadmin,
    [
      body("name", "Enter a valid name").isLength({ min: 5 })
    ],
    async (req, res) => {
      let success = false;
            try {
          const { category,name, number, image,price} = req.body;
          const errors = validationResult(req);
      if(!errors.isEmpty()){
          return res.status(400).json({success,errors: errors.array()});
      }
      const product = new Product({
        category,name, number, image,price
      })
      const savedProduct = await product.save();
      success = true;
      res.json({success,savedProduct});
  
      } catch(error){
          console.error(error.message);
          res.status(500).json({success,error:"Some error occured"})
      }
    }
  );

//Route 3   : Update an existing  product using: PUT "api/admindash/updateproduct" . login required
router.put(
  "/updateproduct/:id",
  fetchadmin,
  async (req, res) => {
      const { number,image,price} = req.body;

      try {
      const newProduct = {};
      if(number){newProduct.number = number};
      if(image){newProduct.image =image};
      if(price){newProduct.price =price};

      let product  = await Product.findById(req.params.id);
      if(!product){return res.status(404).send("Not Found")};
      
      
      product = await Product.findByIdAndUpdate(req.params.id, {$set: newProduct}, {new:true});
      res.json(product);
  } catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured")
  }
  }
);


//Route 4  : Delete an existing  product using: DELETE "api/admindash/deleteproduct" . login required
router.delete(
  "/deleteproduct/:id",
  fetchadmin,
  async (req, res) => {
      try {
      let product  = await Product.findById(req.params.id);
      if(!product){return res.status(404).send("Not Found")};

      
    product = await Product.findByIdAndDelete(req.params.id);
      res.json({"Success": "Product has been deleted", product : product});
  } catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured")
  } 
  }
);

//Route 5 : get all the products using: GET "api/admindash/fetchpizza" . login required
router.get("/fetchpizza", fetchadmin, async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured")
} 
});


//Route 6  : add a new product using: POST "api/admindash/addpizza" . login required
router.post(
  "/addpizza",
  fetchadmin,
  [
    body("name", "Enter a valid name").isLength({ min: 5 })
  ],
  async (req, res) => {
    let success = false;
          try {
        const { name, image,price} = req.body;
        const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors: errors.array()});
    }
    const pizza = new Pizza({
      name, image,price
    })
    const savedPizza = await pizza.save();
    success = true;
    res.json({success,savedPizza});

    } catch(error){
        console.error(error.message);
        res.status(500).json({success,error:"Some error occured"})
    }
  }
);



//Route 4  : Delete an existing  product using: DELETE "api/admindash/deletepizza" . login required
router.delete(
"/deletepizza/:id",
fetchadmin,
async (req, res) => {
    try {
    let pizza = await Pizza.findById(req.params.id);
    if(!pizza){return res.status(404).send("Not Found")};

    
  pizza = await Pizza.findByIdAndDelete(req.params.id);
    res.json({"Success": "Pizza has been deleted", pizza : pizza});
} catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured")
} 
}
);



router.get("/fetchorder", fetchadmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured")
} 
});


router.post('/getuser/:id',fetchadmin,async(req,res)=>{
  try{
      let userid =req.params.id;
      const user = await User.findById(userid).select("-password");
      res.send(user);
  }
  catch(error){
      console.error(error.message);
      res.status(500).send("Internal server Error");
  }
})


router.put(
  "/updateorder/:id",
  fetchadmin,
  async (req, res) => {
      const {status} = req.body;

      try {
      const newProduct = {};
      if(status){newProduct.status = status};

      let order  = await Order.findById(req.params.id);
      if(!order){return res.status(404).send("Not Found")};
      
      
      order = await Order.findByIdAndUpdate(req.params.id, {$set: newProduct}, {new:true});
      const orders = await Order.find();
    res.json(orders);
  } catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured")
  }
  }
);


module.exports = router ;