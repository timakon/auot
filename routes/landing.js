const express = require('express');
const router = express.Router();

const models = require('../models');

router.get('/', (req, res) => {

})
router.get('/registration', (req, res) => {
    if(req.session) {
        req.session.destroy(() =>{
            res.redirect('/auth/');
        });
    } else res.redirect('/auth/')
})

module.exports = router;