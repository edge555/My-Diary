const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
const app = express();

mongoose.Promise=global.Promise;

// Mongoose Connect
mongoose.connect('mongodb://localhost/mydiary', { useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.engine("handlebars", exphbs({
    defaultLayout : 'main'
}));
app.set("view engine", "handlebars");

//Index route
app.get('/',(req,res)=>{
    const title = 'Welcome 1'
    res.render('index',{
        title : title
    });
});

//About page
app.get('/about',(req,res)=>{
    res.render('about');
});

const port = 3000;

app.listen(port,()=>{
    console.log(`Server stared on port ${port}`);
});