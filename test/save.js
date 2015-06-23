var News = require('../models/News');

News.save({
    title:'测试一',
    author: 'luis'
},function(err){
    if(err){
        console.log("error");
        throw err;
        return;
    }

    News.findByName('测试一',function(err,items){
        if(err){
            throw err;
            return;
        }
        console.log(items[0].pubDate.getTime());
    })
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