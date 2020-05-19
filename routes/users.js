const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
module.exports = router;

// User login
router.get('/login', (req, res) => {
    res.render('users/login');
});

// User registration
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Register form POST
router.post('/register',(req,res)=>{
    let errors =[];
    if(req.body.password!=req.body.password2){
        errors.push({text:'Password doesnt match'});
    }
    if (req.body.password.length < 6) {
      errors.push({ text: 'Password length must be atleast 6 characters' });
    }
    if(errors.length!=0){
        res.render("users/register", {
          errors: errors,
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          password2: req.body.password2
        });
    }else{
        res.send('Ok');
    }
});