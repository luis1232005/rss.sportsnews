//引入模块
var mongoose = require('./../lib/mongodb').mongoose;
var Schema = mongoose.Schema;

// create a news schema
var newsSchema = new Schema({
    title: String,
    link: String,
    description: String,
    author: String,
    pubDate: { type: Date,default: Date.now },
    img: String,
    category:String
});

// the schema is useless so far
// we need to create a model using it
var News = mongoose.model('News', newsSchema);

var NewsDAO = function(){
    //todo:constructor
};

NewsDAO.prototype.save = function(obj, callback) {
    var instance = new News(obj);
    instance.save(function(err){
        callback(err);
    });
};

NewsDAO.prototype.findByIdAndUpdate = function(obj,callback){
    var _id=obj._id;
    delete obj._id;
    News.findOneAndUpdate(_id, obj, function(err,obj){
        callback(err, obj);
    });
}


NewsDAO.prototype.findByName = function(name, callback) {
    name = new RegExp('.*' + name + '.*');
    News.find({title:name}, function(err, obj){
        callback(err, obj);
    });
};

//输出单类
module.exports = new NewsDAO();