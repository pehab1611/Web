const createError = require('http-errors');
const path = require('path');
const express = require('express');
const session = require('express-session');

const homeRouter = require('./routes/home.routes');
const cartRouter = require('./routes/cart.routes');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(
    session({
        secret: 'vbi_me',
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 1000 * 60 * 2}
    })
);

app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/cart', cartRouter);

app.listen(3000);
