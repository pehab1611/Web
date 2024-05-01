const express = require('express');
const session = require('express-session');
const router = express.Router();

const myData = require('../data/mydata');

router.get('/', function(req, res, next) {
    res.render('cart');
});

router.post('/add/:id', function (req, res, next) {
    let id = parseInt(req.params.id);
    let cat = Math.floor(id / 5);
    let prod = id % 5;
    console.log("Dodajem proizvod s id: ", id);

    if (req.session.cart) {
        let poz = -1;
        for(let i = 0; i < req.session.cart.length; i++) {
            if(req.session.cart[i] && req.session.cart[i].id == id) {
                poz = i;
                break;
            }
        }
        if(poz >= 0) {
            req.session.cart[poz].productNum++;
        } else {
            const newProd = {'id': id, 'productNum': 1, 'name': myData.categories[cat].products[prod].name};
            req.session.cart.push(newProd);
        }
        
    } else {
        const newProd = {'id': id, 'productNum': 1, 'name': myData.categories[cat].products[prod].name};
        req.session.cart = [newProd];
    }
    console.log(req.session.cart);

    return res.sendStatus(204);
});

router.post('/remove/:id', function (req, res, next) {
    let id = parseInt(req.params.id);
    let poz = -1;
    for(let i = 0; i < req.session.cart.length; i++) {
        if(req.session.cart[i] !== null && req.session.cart[i].id == id) {
            poz = i;
            break;
        }
    }
    if(poz >= 0) {
        if (req.session.cart[poz].productNum > 1) {
            req.session.cart[poz].productNum--;
        } else {
            console.log("TU JE FJASKD fsdhgk jdfh");
            console.log(req.session.cart);
            delete req.session.cart[poz];
        }
        return res.sendStatus(204);
    } else {
        return res.sendStatus(404);
    }
});

router.get('/getAll', function(req, res, next) {
    if(req.session.cart){
        const newCart = [];
        req.session.cart.forEach(prod => {
            if(prod) {
                newCart.push(prod);
            } 
        })
        req.session.cart = newCart;
        res.send({cart : req.session.cart});
    } else {
        req.session.cart = [];
        res.send({cart : req.session.cart});
    }
})

module.exports = router;