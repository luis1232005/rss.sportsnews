var random_useragent = require('random-useragent');
var userAgent = random_useragent.getRandom(function (ua) {
    return ua.deviceType === 'mobile' && ua.deviceModel === "iPhone" || ua.browserName === "Android Browser";
});
//https://images3.c-ctrip.com/dm/public/fuwubiaoqianicon01.png?v=20160511144533探测号码的连接

console.log(userAgent);

var request = require('request');

var options = {
    url: 'http://app.58.com/api/list/ershoufang?tabkey=allcity&action=getListInfo%2CgetFilterInfo%2CgetFormInfo&curVer=6.6.6.0&ct=filter&appId=1&format=json&os=android&localname=bj&v=1&geotype=baidu&location=1%2C%2C&key=&filterParams=%7B%22param1077%22%3A%220%22%2C%22filterLocal%22%3A%22bj%22%2C%22biz%22%3A%220%22%7D&geoia=%2C&params=%7B%7D',
    headers: {
        'User-Agent': userAgent
    }
};

function requestPage(id,callback){
    var arent = random_useragent.getRandom(function (ua) {
        return ua.deviceType === 'mobile' && ua.deviceModel === "iPhone" || ua.browserName === "Android Browser";
    });
    var opt = {
        url: 'http://m.58.com/bj/ershoufang/'+ id + 'x.shtml',
        headers: {
            'User-Agent': arent
        }
    };

    request(opt, callback);
}

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        if(info && info.result && info.result.getListInfo && info.result.getListInfo.infolist){
            console.log(info.result.getListInfo.infolist.length);
            getPages(info.result.getListInfo.infolist);
        }
    }
}

request(options, callback);

var result = [];
var firstEmpty = [];
function getPages(lists){
    var async = require('async');
    async.forEachOf(lists, function (item, key, callback) {
        //fs.readFile(__dirname + value, "utf8", function (err, data) {
        //    if (err) return callback(err);
        //    try {
        //        configs[key] = JSON.parse(data);
        //    } catch (e) {
        //        return callback(e);
        //    }
        //    callback();
        //});
        //https://images3.c-ctrip.com/dm/public/fuwubiaoqianicon01.png?v=20160511144533
        requestPage(item.infoID,function(error, response, body){
            if (!error && response.statusCode == 200) {
                var number = body.match(/<div\s+class=\"phone\"\s+id=\"([1]\d{10})\">/gi);
                if(!number){
                   // console.log("#"+item.infoID);
                    firstEmpty.push(item);
                    console.log(item.infoID);
                }else{
                    number = number.join('').match(/[1]\d{10}/gi);
                    //console.log("ok"+ number[0]);
                    item.phonenum = number[0]||'';
                    result.push(item);
                }
                callback();
            }else{
                return callback(error)
            }
        });
    }, function (err) {
        if (err) console.error(err.message);
        //console.log(result);
        //console.log(firstEmpty);
    })
}
