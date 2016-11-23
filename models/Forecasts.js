//todo:引入模块
var mongoose = require('./../lib/mongodb').mongoose;
var Schema = mongoose.Schema;

// create a Forecasts schema
var ForecastsSchema = new Schema({
    title: String,
    link: String,
    description: String,
    author: String,
    pubDate: { type: Number,default: new Date().getTime() },
    img: String,
    category:String
});

ForecastsSchema.virtual('pubDateTimeStamp').get(function(){
    return this.pubDate.getTime();
});

// the schema is useless so far
// we need to create a model using it
var Forecasts = mongoose.model('Forecasts', ForecastsSchema);

var ForecastsDAO = function(){
    //todo:constructor
};

ForecastsDAO.prototype.save = function(obj, callback) {
    var instance = new Forecasts(obj);
    instance.save(function(err,cb){
        callback(err,cb);
    });
};

ForecastsDAO.prototype.findByIdAndUpdate = function(obj,callback){
    var _id=obj._id;
    delete obj._id;
    Forecasts.findOneAndUpdate(_id, obj, function(err,cb){
        callback(err, cb);
    });
}


ForecastsDAO.prototype.findByName = function(name, callback) {
    name = new RegExp('.*' + name + '.*');
    Forecasts.find({title:name}, function(err, cb){
        callback(err, cb);
    });
};

ForecastsDAO.prototype.findForecastsByPubDate = function(date,callback){
    var date = {
        "$gt":new Date('2015-06-23 00:00:00').getTime()
    };
    Forecasts.find({
        pubDate:date
    }).sort({
        pubDate: -1
    }).exec(function(err, cb){
        callback(err, cb);
    });
};

//输出单类
module.exports = new ForecastsDAO();