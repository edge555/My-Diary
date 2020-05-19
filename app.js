const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
 
// Load routes
const notes = require('./routes/notes');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);
//DB config
const db = require('./config/database');

mongoose.Promise=global.Promise;

// Mongoose Connect
mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Handlebars Middleware
app.engine("handlebars", exphbs({
    defaultLayout : 'main'
}));

app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname,'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session
app.use(
  session({
    secret: 'serect',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global var
app.use(function(req,res,next){
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

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


// Use routes
app.use('/notes',notes);
app.use('/users',users);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server stared on port ${port}`);
});