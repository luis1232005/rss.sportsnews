var News = require('../models/News');

News.save({
    title : '第一条新闻'
},function(err, thor) {
    if (err) return console.error(err);
    console.log("###############");
    console.log(thor);
});

