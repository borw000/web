const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/buy2', (req, res) => {
    res.render('buy2');
});

router.get('/chat', (req, res) => {
    res.render('chat');
});

router.get('/order', (req, res) => {
    res.render('order');
});

module.exports = router;