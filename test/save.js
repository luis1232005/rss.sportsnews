var News = require('../models/News');

News.save({
    title:'test',
    author: 'luis'
},function(err){
    if(err){
        throw err;
        return;
    }

    News.findByName(/.*��.*/g,function(err,item){
        if(err){
            throw err;
            return;
        }
        console.log(item);
    })
});