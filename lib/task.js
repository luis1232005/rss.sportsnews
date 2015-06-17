/**
 * 开始任务模块
 * @moudle task
 */

//加载依赖
var fetch = require('../lib/fetch');
var cUtil = require('../lib/util');
var News = require('../models/News');
var cheerio = require('cheerio');
var parser = require('xml2json');
var _ = require('underscore');

function save(doc){
    News.save(doc,function(err,item){
        if(err){
            throw  err;
            return;
        }

        console.log(doc,'save!');
    });
}

var rssMap = [
    {
        title: "新浪-国际足球",
        url : "http://rss.sina.com.cn/sports/global/focus.xml",
        charset : "utf-8",
        success : function(html,opts){
            var json = JSON.parse(parser.toJson(html));
            var items = json.rss.channel.item;

            _.each(items,function(item,index){
                item.author = '新浪网';
                item.pubDate = cUtil.dateFormat(new Date(item.pubDate),'yyyy-MM-dd hh:mm:ss');
                item.img = '';
                item.category = '新浪网-国际足球';

                save(item);
            });
        }
    },
    {
        title: "网易-国际足球",
        url : "http://sports.163.com/special/00051K7F/rss_sportsgj.xml",
        charset : "utf-8",
        success : function(html,opts){
            var json = JSON.parse(parser.toJson(html));
            var items = json.rss.channel.item;

            _.each(items,function(item,index){
                item.link = items[0].guid['$t'];
                item.description = items[0].description.split('...')[0];
                item.author = '网易网';
                item.pubDate = cUtil.dateFormat(new Date(item.pubDate),'yyyy-MM-dd hh:mm:ss');
                item.img = '';
                item.category = '网易网-国际足球';

                save(item);
            });

            //console.log(items);
        }
    },
    {
        title: "搜狐-国际足球",
        url : "http://rss.sports.sohu.com/rss/guojizutan.xml",
        charset : "utf-8",
        success : function(html,opts){
            var json = JSON.parse(parser.toJson(html));
            var items = json.rss.channel.item;
            var now = new Date();
            var temp;

            _.each(items,function(item,index){
                temp = item.pubDate.split(' ');
                item.author = '网易网';
                item.pubDate = temp[3] + '-' + (now.getMonth()+1) + '-' + temp[1] + ' ' + temp[4];
                item.img = '';
                item.category = '搜狐网-国际足球';
                if(typeof item.description == 'object'){
                    item.description = '';
                }

                save(item);
            });

            ////todo:保存mongodb数据库
            //console.log(items);
        }
    },
    {
        tilte: "华体-国际足球",
        url : "http://we.sportscn.com/category-3.html",
        charset : "gbk",
        success : function(html,opts){
            var $ = cheerio.load(html);

            var items = [],
                item;
            $('.wdls').each(function(){
                item = {};
                item.title = $("ul ol a",this).text();
                item.link = $("ul ol a",this).attr('href');
                item.description = $("ul li",this).text();
                item.author = '华体网';
                item.pubDate = new Date().getFullYear() + '-' + $("ul ol",this).text().split('  ')[1];
                item.img = $("img",this).attr('src');
                item.category = '华体-国际足球';

                items.push(item);

                save(item);
            });

            //console.log(items);
        }
    },
    {
        tilte: "体坛网-西甲",
        url : "http://soccer.titan24.com/app/soccer/list.php?cid=4",
        charset : "gbk",
        success : function(html,opts){
            var $ = cheerio.load(html);

            var items = [],
                item;
            $('.ulline li').each(function(){
                item = {};
                item.title = $("a",this).text();
                item.link = "http://soccer.titan24.com" + $("a",this).attr('href');
                item.description = '';
                item.author = '体坛网';
                item.pubDate = new Date().getFullYear() + '-' + $(".date",this).text();
                item.img = '';
                item.category = '体坛网-西甲';

                items.push(item);

                save(item);
            });

            //console.log(items);
        }
    }
];

//todo:统一处理错误处理，记录抓取日志
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