var mongoose = require('mongoose');
var db = mongoose.connection;

var News = require('../models/News');

//todo:数据库连接处理
db.on('error', console.error.bind(console, 'connection error:'));

//todo:
db.once('open', function (callback) {
    console.log("连接成功！")
});

//开始连接数据库
mongoose.connect('mongodb://localhost/BnjlbDb');
var _n = new News({
    title : '第一条新闻'
});

_n.save(function(err, thor) {
    if (err) return console.error(err);
    console.log("###############");
    console.dir(thor);
});