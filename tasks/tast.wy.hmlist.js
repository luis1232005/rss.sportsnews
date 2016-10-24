//模块载入
var F = require('../lib/pfetch');
var cheerio = require('cheerio');
var Q = require('q');
var fs = require('fs');

//常量
var URL = 'http://www.woying.com/together?status=1&money=&guar=&initiator_like=&type=&sort=12&lotteryId=';
var URL_MAPS = {
  DFW_DETAIL_SOA: 'http://soa.woying.com/user/trade/HemaiDetail?SvRet=1&sv=1&Id={id}',
  DFW_BJDC_SOA: 'http://soa.woying.com/lottery/buy/sale_hemai_hall?guarType=0&LotteryId=3,5,6,7,8,9&pageIndex=1&SortType=2&progressType=0&initiatorName=&Sort=1&rateType=0',
  DFW_VIP_BJDC : 'http://www.woying.com/together?status=1&money=&guar=&initiator_like=足彩大富翁VIP&type=&sort=12&lotteryId=3,4,5,6,7,8,9'
};

//定义promise的保存文件方法
function saveResult(path , ct ,callback){
    var deferred = Q.defer();

    fs.writeFile(path,ct, function(err) {
        if(err) {
            deferred.reject(err);
        }else{
            deferred.resolve(path);
        }
    });

    return deferred.promise.nodeify(callback);
}

//获得合买的ids
function getAllGameIds(html,callback){
    var items = [];
    var deferred = Q.defer();

    try{
        var $ = cheerio.load(html);
        $('.btn_twoword').each(function(){
            items.push($(this).attr('onclick').substr(5,9));
        });

        deferred.resolve(items);
    }catch(e){
        deferred.reject(err);
    }

    return deferred.promise.nodeify(callback);
}


//获得合买页面
function createFetchAllGamePage(id,callbck){
    var url = '';
    if(!!id){
        url = 'http://www.woying.com/together/scheme_info/' + id;
    }
    return F.fetchPage({
        url: url,
        id: id
    });
}


F.fetchPage({
    url: URL_MAPS.DFW_VIP_BJDC
})
.then(getAllGameIds)
.then(function (items) {
    var gamesFetchs = [];
    items.forEach(function(id){
        gamesFetchs.push(createFetchAllGamePage(id));
    });
    return Q.all(gamesFetchs);
})
.then(function(htmls,params){
    console.log(htmls.length);
    console.log(params);
})

//var dStr = new Date().getFullYear() + '_' + new Date().getMonth() + '_'+new Date().getDate();
//
//writeFile("../database/"+ dStr + "-" +"keys.txt",items.join(','));