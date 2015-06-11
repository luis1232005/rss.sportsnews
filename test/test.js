//加载依赖
var cheerio = require('cheerio');
var fs = require('fs');
var http = require('http');
var iconv = require('iconv-lite');
var parser = require('xml2json');

http.get('http://rss.sina.com.cn/sports/global/england.xml',function(res){
    var html = '';

    res.setEncoding('binary');

    res.on('data', function(chunk){
        html += chunk;
    });

    res.on('end', function(){
        html = iconv.decode(html, 'utf-8');
        console.log(html);
        if(!html){
            return false;
        }

        //解析xml文档
        var json = parser.toJson(html);

        console.log(json);
    });
}).on('error',function(e){
    console.log("错误：" + e.message);
});