const path = require('path')
const express = require('express');
const app = express()
const DBConnection = require('./database/db.js');
const User = require('./models/user.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config();


app.use(express.json());
app.use(express.urlencoded({extended: true}))

DBConnection();
app.get('/',(req,res)=>{
    res.send("Hello World!");
})

//register user
app.post('/register', async(req,res)=>{
    try {
        const {firstName, lastName, email, password} = req.body;

        if(!(firstName || lastName || email || password)){
            return res.status(401).send('Please enter all the required credentials');
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).send('User already exits!');
        }

        const hashPassword = bcrypt.hashSync(password,10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword
        })

        const token = jwt.sign({id:user._id,email},process.env.SECRET_KEY,{
            expiresIn:"1h"
        })

        user.password = undefined;
        res.status(201).json({
            message:'You have successfully registered',
            user
        })
    } catch (error) {
        console.log(error);
    }
})

//login user
app.post('/login',(req,res) => {
    try{
        const {email, password} = req.body();
        if(!email || !password){
            res.status(400).send("Please enter the credentials");
        }

    }catch(error){

    }
})

app.listen(8000,()=>{
    console.log("Server is running on port 8000")
})