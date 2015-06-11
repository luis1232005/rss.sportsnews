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
    //{
    //    title: "新浪-国际足球",
    //    url : "http://rss.sina.com.cn/sports/global/focus.xml",
    //    charset : "utf-8",
    //    success : function(html,opts){
    //        var json = parser.toJson(html);
    //
    //        //todo:保存mongodb数据库
    //        console.log(json);
    //    }
    //},
    //{
    //    title: "网易-国际足球",
    //    url : "http://sports.163.com/special/00051K7F/rss_sportsgj.xml",
    //    charset : "utf-8",
    //    success : function(html,opts){
    //        var json = parser.toJson(html);
    //
    //        //todo:保存mongodb数据库
    //        console.log(json);
    //    }
    //},
    //{
    //    title: "搜狐-国际足球",
    //    url : "http://rss.sports.sohu.com/rss/guojizutan.xml",
    //    charset : "utf-8",
    //    success : function(html,opts){
    //        var json = parser.toJson(html);
    //
    //        //todo:保存mongodb数据库
    //        console.log(json);
    //    }
    //},
    {
        tilte: "华体-国际足球",
        url : "http://we.sportscn.com/category-3.html",
        charset : "gbk",
        success : function(html,opts){
            $ = cheerio.load(html);

            var items = [],
                item;
            $('.wdls').each(function(){
                item = {};
                item.title = $("ul ol a",this).text();
                item.link = $("ul ol a",this).attr('href');
                item.description = $("ul li",this).text();
                item.author = '华体网';
                item.pubDate = '';
                item.img = $("img",this).attr('src');
                item.category = '华体-国际足球';

                items.push(item);
            });

            console.log(items);
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