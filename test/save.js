var News = require('../models/News');

News.save({
    title:'测试一123',
    author: 'luis'
},function(err){
    if(err){
        console.log("error");
        throw err;
        return;
    }

    console.log("保存成功!");
});


//News.findByName('.*巴萨.*',function(err,item){
//    if(err){
//        console.log("error!");
//        throw err;
//        return;
//    }
//    console.log("@@@@@@@@@@@@@@@@");
//    console.log(arguments);
//})