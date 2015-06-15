//加载依赖
var task = require('../lib/task');
var mongoose = require('mongoose');
var db = mongoose.connection;

//todo:数据库连接处理
db.on('error', console.error.bind(console, 'connection error:'));

//todo:
db.once('open', function () {
    //create Schema and models
    console.log("连接成功！");
    console.log("############################");
    task.start();
});
mongoose.connect('mongodb://localhost/BnjlbDb');