const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated}= require('../helper/auth');


module.exports = router;
// Load Note Model
require('../models/Note');
const Note = mongoose.model('notes');

// Notes Index Page
router.get('/',ensureAuthenticated, (req, res) => {
    Note.find({user:req.user.id})
        .sort({ date: 'desc' })
        .lean()
        .then(notes => {
            res.render('notes/index', {
                notes: notes
            });
        });
})

// Add notes
router.get('/add',ensureAuthenticated, (req, res) => {
    res.render('notes/add');
});

// Edit notes
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Note.findOne({
        _id: req.params.id
    })
    .lean()
    .then(notes => {
        if(notes.user!=req.user.id){
            req.flash('error_msg','Not authorized');
            res.redirect('/notes');
        }else{
            res.render('notes/edit', {
                notes: notes
            });
        }
    });
});

// Process form
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Title cant be emtpy' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please write something' });
    }
    if (errors.length != 0) {
        res.render('notes/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user : req.user._id
        }
        new Note(newUser)
            .save()
            .then(note => {
                req.flash("success_msg", "Note Added");
                res.redirect('/notes');
            })
    }
});

// Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Note.findOne({
        _id: req.params.id
    })
        .then(notes => {
            notes.title = req.body.title;
            notes.details = req.body.details;
            notes.save()
                .then(notes => {
                    req.flash("success_msg", "Note Updated");
                    res.redirect('/notes');
                })
        })
});

// Delete notes
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Note.remove({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Note Deleted");
        res.redirect("/notes");
    });
})
