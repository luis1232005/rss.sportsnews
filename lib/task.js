/**
 * 开始任务模块
 * @moudle task
 */

//加载依赖
var fetch = require('../lib/fetch');
var cheerio = require('cheerio');
var parser = require('xml2json');
var _ = require('underscore');

var rssMap = [
    {
        "url" : "http://rss.sina.com.cn/sports/global/focus.xml",
        "charset" : "utf-8",
        "type" : "xml",
        "success" : function(html,opts){
            console.log(html);
        }
    }
];

//todo:统一处理错误
function errorCallBack(e){

}


module.exports = {
    start:function(){
        //start fetch
        if(_.isArray(rssMap)){
            _.each(rssMap , function(item,index){
                var opts = {
                    error : errorCallBack
                };

                _.extend(opts,item);

                fetch.getHtml(opts);
            });
        }
    }
};