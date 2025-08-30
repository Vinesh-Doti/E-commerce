const port=4000;
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const multer=require('multer')
const path=require('path');
const cors=require('cors');
const { type } = require('os');
const { log } = require('console');

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect("mongodb+srv://Vinesh:Vinesh123@cluster0.hn7mv49.mongodb.net/e-commerce")

// API creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

// Image storage Engine

const storage=multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload=multer({storage:storage})

//creating upload Endpoint for images

app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`   
    })
})

// Schema for creating products

const Product=mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,   
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    }
})

app.post('/addproduct',async(req,res)=>{
    let products=await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;
    }
    else{
        id=1;
    }
    const product=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating API for Deleting Product

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:1,
        name:req.body.name
    })
})

// creating API getting all products
app.get('/allproducts',async (req,res)=>{
    let products=await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

//creating Schema for user model

const User=mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})
//creating Endpoint for registering user
app.post('/signup',async(req,res)=>{


    let check=await User.findOne({email:req.body.email});
    if(check)
    {
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart={};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;   
    }
    const user=new User({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data={
        user:{
            id:user.id
        }
    }

    const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//creating endpoint for the user login
app.post('/login',async(req,res)=>{
    let user=await User.findOne({email:req.body.email});
    if(user){
        const passCompare=req.body.password===user.password;
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else
        {
            res.json({success:false,errors:"Wrong Password"})
        }
    }
    else{
        res.json({success:false,errors:"wrong Email Id"})
    }
})
//creating endpoint for newcollection data
app.get('/newcollections',async(req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    console.log("New Collection Fetched")
    res.send(newcollection);
})

//creating endpoint for popular in women section

app.get('/popularinwomen',async(req,res)=>{
    let products=await Product.find({category:"women"})
    let popular_in_women=products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

//creating middleware to fetch user 

const fetchuser=async (req,res,next)=>{
    const token =req.header('auth-token');
    if(!token)
    {
        res.status(401).send({errors:"Please authenticate using valid token"});
    }
    else{
        try{
            const data=jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
        }catch(error){
            res.status(401).send({errors:"Please authenticate with a valid token"})
        }
    }
}

//creating endpoint for adding products in cartdata

// app.post('/addtocart',fetchuser,async(req,res)=>{
//     console.log("Added",req.body.itemId);
//     let userData=await User.findOne({_id:req.user.id});
//     userData.cartData[req.body.itemId]+=1;
//     await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
//     res.send("Added");
// })

app.post('/addtocart', fetchuser, async (req, res) => {
    try {
        const { itemId } = req.body;
        console.log("Adding item:", itemId, "User ID:", req.user.id);
        if (!itemId) {
            return res.status(400).json({ success: false, error: "itemId is required" });
        }
        const user = await User.findOneAndUpdate(
            { _id: req.user.id },
            { $inc: { [`cartData.${String(itemId)}`]: 1 } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        console.log("Updated cartData:", user.cartData);
        res.json({ success: true, cartData: user.cartData });
    } catch (error) {
        console.error("Error in addtocart:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

//creating endpoint to remove product from cartdata
// app.post('/removefromcart',fetchuser,async(req,res)=>{
//     console.log("Removed",req.body.itemId);
//     let userData=await User.findOne({_id:req.user.id});
//     if(userData.cartData[req.body.itemId]>0)
//     userData.cartData[req.body.itemId]-=1;
//     await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
//     res.send("Removed");
// })

// Creating endpoint to remove product from cartdata
app.post('/removefromcart', fetchuser, async (req, res) => {
    try {
        const { itemId } = req.body;
        console.log("Removing item:", itemId, "User ID:", req.user.id);
        if (!itemId) {
            return res.status(400).json({ success: false, error: "itemId is required" });
        }
        const user = await User.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        if (user.cartData[String(itemId)] > 0) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                { $inc: { [`cartData.${String(itemId)}`]: -1 } },
                { new: true }
            );
            console.log("Updated cartData:", updatedUser.cartData);
            res.json({ success: true, cartData: updatedUser.cartData });
        } else {
            res.json({ success: false, error: "Item quantity already 0" });
        }
    } catch (error) {
        console.error("Error in removefromcart:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/getcart', fetchuser, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        res.json({ success: true, cartData: user.cartData });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port,(error)=>{
    if(!error)
    {
        console.log("Server running on Port "+port)
    }
    else{
        console.log("Error:"+error);
    }
})