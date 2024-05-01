const express = require('express');
const router = express.Router();
router.use(express.static('public'));

const myData = require('../data/mydata');

router.get('/', function(req, res, next) {
    res.render('home', {data : myData.categories[0]});
});

router.get('/getCategories', function(req, res, next) {
    console.log('Poslane sve kategorije');
    const categories = [];
    myData.categories.forEach(cat => {
        categories.push(cat.name);
    });
    res.send({categories : categories});
});

router.get('/getProducts/:id', function(req, res, next) {
    var categoryId = parseInt(req.params.id);
    console.log(`Poslani proizvodi kategorije ${categoryId}`);
    res.send({data : myData.categories[categoryId]});
});

module.exports = router;