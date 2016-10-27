/**
 * @des 陆慧明任九 爬虫可以使用 node-crawler这个模块比较简单 
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

            if(text.indexOf('任九') > -1 && text.indexOf('陆慧明') > -1 && $(this).attr('href')){
                console.log(text.indexOf('任九'));
                items.push($(this).attr('href'));
            }
        });
        console.log(items);
        deferred.resolve(items);
    }catch(e){
        deferred.reject(err);
    }

    return deferred.promise.nodeify(callback);
}

function formatHtml(html){
    //var $ = cheerio.load(html);
    //console.log($('#artibody'));
    //var txt = $('#artibody').get(0).tagName;
    //console.log(html);
    html = html.replace(/\r\n/gmi,'').replace(/\n+|\r|\n/gmi,'');
   // console.log(html);
    var reg = /<!-- 正文内容 begin -->(.*)<!-- 正文内容 end -->/gmi;
    var match = html.match(reg);

    html =  (match && match[0]) || '';
    match = html.match(/[0|1]\d&nbsp;[^>]*<\/p>/gmi);

    console.log(match);
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
    return Q.all(urlFetchs);
}

F.fetchPage({
    url: 'http://sports.sina.com.cn/l/luhuiming/'
})
.then(getAllGameIds)
.then(createPromiseList)
.then(function(htmls){
    formatHtml(htmls[0]);
})