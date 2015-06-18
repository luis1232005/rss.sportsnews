var express = require('express');
var router = express.Router();

var News = require('../models/News');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/getnews',function(req, res) {
    News.findByName('test',function(err, obj){
        res.send(obj);
    });
});

module.exports = router;