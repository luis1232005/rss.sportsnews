//引入模块
var mongoose = require('./../lib/mongodb').mongoose;
var Schema = mongoose.Schema;

// create a news schema
var NewsSchema = new Schema({
    title: String,
    link: String,
    description: String,
    author: String,
    pubDate: { type: Number,default: new Date().getTime() },
    img: String,
    category:String
});

NewsSchema.virtual('pubDateTimeStamp').get(function(){
    return this.pubDate.getTime();
});

// the schema is useless so far
// we need to create a model using it
var News = mongoose.model('News', NewsSchema);

var NewsDAO = function(){
    //todo:constructor
};

NewsDAO.prototype.save = function(obj, callback) {
    var instance = new News(obj);
    instance.save(function(err,cb){
        callback(err,cb);
    });
};

NewsDAO.prototype.findByIdAndUpdate = function(obj,callback){
    var _id=obj._id;
    delete obj._id;
    News.findOneAndUpdate(_id, obj, function(err,cb){
        callback(err, cb);
    });
}


NewsDAO.prototype.findByName = function(name, callback) {
    name = new RegExp('.*' + name + '.*');
    News.find({title:name}, function(err, cb){
        callback(err, cb);
    });
};

NewsDAO.prototype.findNewsByPubDate = function(date,callback){
    var date = {
        "$gt":new Date('2015-06-23 00:00:00').getTime()
    };
    News.find({
        pubDate:date
    }).sort({
        pubDate: -1
    }).exec(function(err, cb){
        callback(err, cb);
    });
};

//输出单类
module.exports = new NewsDAO();