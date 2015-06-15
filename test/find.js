//加载依赖
var mongoose = require('mongoose');
var db = mongoose.connection;
var _ = require('underscore');

//todo:数据库连接处理
db.on('error', console.error.bind(console, 'connection error:'));

//todo:
db.once('open', function () {
    //create Schema and models
    console.log("连接成功！");
    var News = require('../models/news');
    News.find({title:/.*巴萨.*/g},function(err,items){
        if(err) throw err;
        _.each(items,function(item,index){
            console.log(item.pubDate + "|" +item.title + '\n');
        });
    });
});
mongoose.connect('mongodb://localhost/BnjlbDb');