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