/**
 * Lottery竞彩赛事表
 * @author luis
 * @type {*|mongoose}
 */
//引入模块
var mongoose = require('./../lib/mongodb').mongoose;
var Schema = mongoose.Schema;

// create a Lottery schema
var LotterySchema = new Schema({
    name: String,//对战名称
    home: String,//主队名称
    guest: String,//客队名称
    result: {type:Number,default:-1},//结果
    score: String,//比分
    play: [{
        playType:Number,//玩法 1：不让球玩法，2：让球玩法
        odds:String,//对应赔率
        concedePoint:Number,//让几球
        result: {type:Number,default:-1}
    }],
    playDate: { type: Date,default:Date.now },
    updateDate:Date,
    createDate:Date
});

//LotterySchema.virtual('pubDateTimeStamp').get(function(){
//    return this.pubDate.getTime();
//});

// the schema is useless so far
// we need to create a model using it
var Lottery = mongoose.model('Lottery', LotterySchema);

var LotteryDAO = function(){
    //todo:constructor
};

LotteryDAO.prototype.save = function(obj, callback) {
    var instance = new Lottery(obj);
    instance.save(function(err,cb){
        callback(err,cb);
    });
};

//LotteryDAO.prototype.findByIdAndUpdate = function(obj,callback){
//    var _id=obj._id;
//    delete obj._id;
//    Lottery.findOneAndUpdate(_id, obj, function(err,cb){
//        callback(err, cb);
//    });
//}
//
//
//LotteryDAO.prototype.findByName = function(name, callback) {
//    name = new RegExp('.*' + name + '.*');
//    Lottery.find({title:name}, function(err, cb){
//        callback(err, cb);
//    });
//};
//
//LotteryDAO.prototype.findLotteryByPubDate = function(date,callback){
//    var date = {
//        "$gt":new Date('2015-06-23 00:00:00').getTime()
//    };
//    Lottery.find({
//        pubDate:date
//    }).sort({
//        pubDate: -1
//    }).exec(function(err, cb){
//        callback(err, cb);
//    });
//};

//输出单类
module.exports = new LotteryDAO();