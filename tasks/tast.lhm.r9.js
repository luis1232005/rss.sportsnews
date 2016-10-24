/**
 * @des 陆慧明任九
 * @url http://sports.sina.com.cn/l/luhuiming/?from=wap
 *
 */

//模块载入
var F = require('../lib/pfetch');
var cheerio = require('cheerio');
var Q = require('q');
var fs = require('fs');

//分析内容
function getAllGameIds(html,callback){
    var items = [];
    var deferred = Q.defer();

    try{
        var $ = cheerio.load(html);
        $('.a04').each(function(){
            var text = $(this).text() || '';
            if(text.indexOf('陆慧明任九') && $(this).attr('href')){
                items.push($(this).attr('href'));
            }
        });

        deferred.resolve(items);
    }catch(e){
        deferred.reject(err);
    }

    return deferred.promise.nodeify(callback);
}

//获得合买页面
function createPromiseList(urls,callbck){
    var urlFetchs = [];
    var urls = urls || [];

    urls.forEach(function(url){
        urlFetchs.push(F.fetchPage({
            url: url
        }));
    });
    return Q.allSettled(urlFetchs);
}

F.fetchPage({
    url: 'http://sports.sina.com.cn/l/luhuiming/'
})
.then(getAllGameIds)
.then(createPromiseList)
.then(function(htmls){
    console.log(htmls);
})