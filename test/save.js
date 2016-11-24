var News = require('../models/News');
var Lottery = require('../models/Lottery');


//News.save({
//    title:'测试一123',
//    author: 'luis'
//},function(err){
//    if(err){
//        console.log("error");
//        throw err;
//        return;
//    }
//
//    console.log("保存成功!");
//});


//News.findByName('.*巴萨.*',function(err,item){
//    if(err){
//        console.log("error!");
//        throw err;
//        return;
//    }
//    console.log("@@@@@@@@@@@@@@@@");
//    console.log(arguments);
//})

//Lottery.save({
//    name: "测试1vs测试2",//对战名称
//    home: "测试1",//主队名称
//    guest: "测试2",//客队名称
//    score: "",//比分
//    play: [{
//        playType: '1',//玩法 1：不让球玩法，2：让球玩法
//        odds:"1.2|3.2|6.7",//对应赔率
//        concedePoint:0,//让几球
//    }],
//    playDate: new Date('2015-09-10 12:00'),
//    updateDate: new Date(),
//    createDate: new Date()
//},function(err){
//    if(err){
//        console.log(err.errors);
//        throw err;
//        return;
//    }
//
//    console.log("保存成功!");
//});

Lottery.findByName("测试1vs测试2",function(err){
    console.log(arguments);
});