/**
 * 抓取模块
 * @moudle fetch
 */

//载入模块
var fs = require('fs');
var http = require('http');
var iconv = require('iconv-lite');

module.exports = {
    /**
     * 抓取网页内容
     * @method getHtml
     * @param {object} opts
     * @param {string} opts.url 抓取地址
     * @param {function} opts.success 成功时回调函数
     * @param {function} opts.error 失败时回调函数
     */
    getHtml:function(opts){
        if(opts && !opts.url){
            opts.error && opts.error(new Error('url is empty!'));
            return false;
        }

        http.get(opts.url,function(res){
            var html = '';

            res.setEncoding('binary');

            res.on('data', function(chunk){
                html += chunk;
            });

            res.on('end', function(){
                html = iconv.decode(html,opts.charset||'utf-8');

                opts.success && opts.success(html);
            });
        }).on('error',function(e){
            opts.error && opts.error(e);
        });
    }
};