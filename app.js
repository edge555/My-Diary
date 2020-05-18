const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.Promise=global.Promise;

// Mongoose Connect
mongoose.connect('mongodb://localhost/mydiary', { useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Load Note Model
require('./models/Note');
const Note = mongoose.model('notes');

// Handlebars Middleware
app.engine("handlebars", exphbs({
    defaultLayout : 'main'
}));

app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Index route
app.get('/',(req,res)=>{
    const title = 'Welcome'
    res.render('index',{
        title : title
    });
});

// About page
app.get('/about',(req,res)=>{
    res.render('about');
});

// Notes Index Page
app.get('/notes',(req,res)=>{
    Note.find({})
    .sort({date:'desc'})
    .lean()
    .then(notes =>{
        res.render('notes/index',{
            notes:notes
        });
    });  
})

// Add Diary
app.get('/notes/add', (req, res) => {
    res.render('notes/add');
});

// Process form
app.post('/notes',(req,res)=>{
    let errors=[];
    if(!req.body.title){
        errors.push({text:'Title cant be emtpy'});
    }
    if(!req.body.details){
        errors.push({text:'Please write something'});
    }
    if(errors.length!=0){
        res.render('notes/add',{
            errors: errors,
            title: req.body.title,
            details:req.body.details
        });
    } else{
        const newUser={
            title:req.body.title,
            details:req.body.details
        }
        new Note(newUser)
        .save()
        .then(note =>{
            res.redirect('/notes');
        })
    }
});

const port = 3000;
app.listen(port,()=>{
    console.log(`Server stared on port ${port}`);
});