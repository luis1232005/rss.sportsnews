//载入模块
var express = require('express');
var router = express.Router();
var News = require('../models/News');
var _ = require('../lib/util');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

//
router.get('/getnews',function(req, res) {
    var key = req.query.key ||'';
    News.findByName(key,function(err, obj){
        if(err){
            res.send({'success':false,'err':err});
        }else{
            //去重，排序
            res.send({
                'success': true,
                'items' : _.uniq(obj,false,"title")
            });
        }
    });
});

module.exports = router;