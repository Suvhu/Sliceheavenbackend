const express = require('express');
const User = require('../models/User');
const {body, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fetchuser = require('../middleware/fetchuser');
const  nodemailer = require("nodemailer");

const JWT_SECRET = 'Subuswain';

// email config

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"subhashishswain3@gmail.com",
        pass:"ovhc gfzs johh ljzj"
    }
})

// Route - 1 -- Creating a user using : Post "api/authuser/createuser" . No log in required
router.post('/createuser',[body('name','Enter a valid name').isLength({min: 5}),body('email','Enter a valid email').isEmail(),body('password','short password').isLength({min: 5}),body('number','Enter a valid number').isLength(10)], async(req,res)=>{
    let success = false;
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({success,errors: errors.array()});
        }

        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({success,error:"sry a user with this email is already exist"});
        }
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt);

        user= await User.create({
            name: req.body.name,
            password: secpass,
            email: req.body.email,
            city: req.body.city,
            town: req.body.town,
            district: req.body.district ,
            number : req.body.number
        })


        const data ={
            user:{
                id: user.id
            }
        }

        const authtoken =jwt.sign(data, JWT_SECRET);
        success = true ;
        res.json({success, authtoken});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

// Route - 2 -- Authenticate a User using: POST "api/authuser/login" . No login required

router.post('/login',[body('email','Enter a valid email').isEmail(),body('password','password cannot be blank').exists()],async(req,res)=>{
    let success = false ;
    try{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({success, error: error.array()});
        }
        const {email, password}= req.body;

        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success,error: "please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if(!passwordCompare){
            return res.status(400).json({success,error: "please try to login with correct credentials"});
        }

        const data ={
            user:{
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success= true ;
        res.json({success, authtoken});

    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})


// router - 3 -- get loggedin a User Details using: POST "api/authuser/getuser" . login required

router.post('/getuser',fetchuser,async(req,res)=>{
    try{
        let userid =req.user.id;
        const user = await User.findById(userid).select("-password");
        res.send(user);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})


// router - 4 -- password reset using: POST "api/authuser/resetpassword" . no login required

router.post('/resetpassword',[body('email','Enter a valid email').isEmail()], async(req,res)=>{
    let success = false ;
    try{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({success, error: error.array()});
        }
        let user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(400).json({success,error: "please try to login with correct credentials"});
        }

        const data ={
            user:{
                id: user.id
            }
        }

        const token = jwt.sign(data, JWT_SECRET,{expiresIn:"120s"});

        // console.log("token", token);
         
        const setusertoken = await User.findByIdAndUpdate(user.id,{verifytoken:token},{new: true})

        // console.log("setusertoken", setusertoken);

        const email = req.body.email ;
        if(setusertoken){
            const mailOptions = {
                from:"subhashishswain3@gmail.com",
                to:email,
                subject: "Sending email for password reset",
                text:`This link is valid for 2  minutes http://localhost:3000/forgotpassword/${user.id}/${setusertoken.verifytoken}`
            }
            transporter.sendMail(mailOptions,(error,info)=>{
               if(error){
                   console.log("error",error);
                   return res.status(201).json({success,error:"email not send"})
               }
               else{
                   console.log("email sent",info.response);
                    
               }
            })
         }

        
        success= true ;
        res.json({success,message:"email sent successfully"});

    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

//Route 5 : verify an user for forgot password time: GET "api/authuser/forgotpassword" . no  login required
router.get("/forgotpassword/:id/:token",async (req, res) => {
    let success = false ;
    try {
        const { id, token } = req.params;

        const validuser = await User.findOne({_id: id, verifytoken:token});

        const verifytoken = jwt.verify(token,JWT_SECRET);

        // console.log(validuser);
        // console.log(verifytoken);

        if(validuser && verifytoken.user.id){
            success= true;
            res.json({success});
        }
        else{
            return res.status(400).json({success,message:"user not exist"})
        }


    } catch(error){
    //   res.status(500).send("Some error occured")
      res.json({success});
  } 
  });


// change password using -- api/authuser/:id/:token
router.post("/:id/:token",async (req, res) => {
    let success = false ;
    try {
        const { id, token } = req.params;
        const {password} = req.body;

        const validuser = await User.findOne({_id: id, verifytoken:token});

        const verifytoken = jwt.verify(token,JWT_SECRET);

        // console.log(validuser);
        // console.log(verifytoken);

        if(validuser && verifytoken.user.id){
            const salt = await bcrypt.genSalt(10);
            const newpassword = await bcrypt.hash(password, salt);

            const setnewuserpass = await User.findByIdAndUpdate({_id: id},{password: newpassword});

            setnewuserpass.save();

            success= true; 
            res.json({success});
        }
        else{
            return res.status(400).json({success,message:"user not exist"})
        }


    } catch(error){
      console.error(error.message);
      res.status(500).send({success});
  } 
  });


  router.put(
    "/updateuser/:id",
    fetchuser,
    async (req, res) => {
        const { name,city,town,district,number} = req.body;
  
        try {
        const newUser = {};
        if(name){newUser.name = name};
        if(city){newUser.city =city};
        if(town){newUser.town =town};
        if(district){newUser.district = district};
        if(number){newUser.number = number};
  
        let user  = await User.findById(req.params.id);
        if(!user){return res.status(404).send("Not Found")};
        
        
        user = await User.findByIdAndUpdate(req.params.id, {$set: newUser}, {new:true});
        res.json(user);
    } catch(error){
        console.error(error.message);
        res.status(500).send("Some error occured")
    }
    }
  );




module.exports = router ;
