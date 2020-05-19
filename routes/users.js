const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
module.exports = router;

// Load user model
require('../models/User');
const User = mongoose.model('users');

// User login
router.get('/login', (req, res) => {
    res.render('users/login');
});

// User registration
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Login form post
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/notes',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
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
        User.findOne({email : req.body.email})
        .then(user =>{
            if(user){
                req.flash('error_msg','Email already used');
                res.redirect('/users/register');
            }else{
                const newUser = new User({
                  name: req.body.name,
                  email: req.body.email,
                  password: req.body.password,
                });
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                      throw err;
                    } else {
                      newUser.password = hash;
                      newUser
                        .save()
                        .then((user) => {
                          req.flash("success_msg", "Registration successful");
                          res.redirect('/users/login');
                        })
                        .catch((err) => {
                          console.log(err);
                          return;
                        });
                    }
                  });
                });
            }
        });
        
    }
});