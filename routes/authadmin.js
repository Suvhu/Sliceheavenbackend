const express = require('express');
const Admin = require('../models/Admin');
const {body, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fetchadmin = require('../middleware/fetchadmin');
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

// Route - 1 -- Creating a admin using : Post "api/authadmin/createadmin" . No log in required
router.post('/createadmin',[body('name','Enter a valid name').isLength({min: 5}),body('email','Enter a valid email').isEmail(),body('password','short password').isLength({min: 5}),body('secretkey','Enter a valid key').isLength(5) ], async(req,res)=>{
    let success = false;
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({success,errors: errors.array()});
        }
        if(req.body.secretkey != '1@3$5'){
            return res.status(400).json({success,errors: "Enter correct secret key"});
        }

        let admin = await Admin.findOne({email: req.body.email});
        if(admin){
            return res.status(400).json({success,errors:"sry a admin with this email is already exist"});
        }
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt);

        admin= await Admin.create({
            name: req.body.name,
            password: secpass,
            email: req.body.email
        })


        const data ={
            admin:{
                id: admin.id
            }
        }

        const authtoken =jwt.sign(data, JWT_SECRET,{expiresIn:'60s'});
        success = true ;
        res.json({success, authtoken});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

// Route - 2 -- Authenticate a admin using: POST "api/auth/login" . No login required

router.post('/login',[body('email','Enter a valid email').isEmail(),body('password','password cannot be blank').exists()],async(req,res)=>{
    let success = false ;
    try{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({success, error: error.array()});
        }
        const {email, password}= req.body;

        let admin = await Admin.findOne({email});
        if(!admin){
            return res.status(400).json({success,error: "please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, admin.password);

        if(!passwordCompare){
            return res.status(400).json({success,error: "please try to login with correct credentials"});
        }

        const data ={
            admin:{
                id: admin.id
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


// router - 3 -- get loggedin a User Details using: POST "api/auth/getuser" . login required

router.post('/getadmin',fetchadmin,async(req,res)=>{
    try{
        let adminid =req.admin.id;
        const admin = await Admin.findById(adminid).select("-password");
        res.send(admin);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})


// router - 4 -- password reset using: POST "api/authadmin/resetpassword" . no login required

router.post('/resetpassword',[body('email','Enter a valid email').isEmail()], async(req,res)=>{
    let success = false ;
    try{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({success, error: error.array()});
        }
        let admin = await Admin.findOne({email: req.body.email});
        if(!admin){
            return res.status(400).json({success,error: "please try to login with correct credentials"});
        }

        const data ={
            admin:{
                id: admin.id
            }
        }

        const token = jwt.sign(data, JWT_SECRET,{expiresIn:"120s"});

        // console.log("token", token);
         
        const setadmintoken = await Admin.findByIdAndUpdate(admin.id,{verifytoken:token},{new: true})

        // console.log("setusertoken", setusertoken);

        const email = req.body.email ;
        if(setadmintoken){
            const mailOptions = {
                from:"subhashishswain3@gmail.com",
                to:email,
                subject: "Sending email for password reset",
                text:`This link is valid for 2  minutes http://localhost:3000/aforgotpassword/${admin.id}/${setadmintoken.verifytoken}`
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

        const validadmin = await Admin.findOne({_id: id, verifytoken:token});

        const verifytoken = jwt.verify(token,JWT_SECRET);

        // console.log(validadmin);
        // console.log(verifytoken);

        if(validadmin && verifytoken.admin.id){
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

        const validadmin = await Admin.findOne({_id: id, verifytoken:token});

        const verifytoken = jwt.verify(token,JWT_SECRET);

        // console.log(validadmin);
        console.log(verifytoken);

        if(validadmin && verifytoken.admin.id){
            const salt = await bcrypt.genSalt(10);
            const newpassword = await bcrypt.hash(password, salt);

            const setnewadminpass = await Admin.findByIdAndUpdate({_id: id},{password: newpassword});

            setnewadminpass.save();

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

module.exports = router ;
