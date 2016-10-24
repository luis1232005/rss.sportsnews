var Q = require('q');
var http = require('http');
var iconv = require('iconv-lite');

function fetchPage(opts,callback){
    var deferred = Q.defer();

    if(opts && !opts.url){
        deferred.reject(new Error('opts or opts.url params is error'));
    }else{
        http.get(opts.url,function(res){
            var html = '';

            res.setEncoding('binary');

            res.on('data', function(chunk){
                html += chunk;
            });

            res.on('end', function(){
                html = iconv.decode(html,opts.charset||'utf-8');
                deferred.resolve(html);
            });
        }).on('error',function(err){
            deferred.reject(err);
        });
    }

    return deferred.promise.nodeify(callback);
}

////支持promise写法
//fetchPage({
//    url: 'http://www.woying.com/together?status=1&money=&guar=&initiator_like=&type=&sort=12&lotteryId='
//}).then(function(html){
//    console.log(html);
//});

////支持callback方式的写法
//getHtml({
//    url: 'http://www.woying.com/together?status=1&money=&guar=&initiator_like=&type=&sort=12&lotteryId=',
//},function(err,html){
//    console.log(html);
//    console.log("#############");
//});


module.exports = {
    /**
     * 抓取网页内容
     * @method fetchPage
     * @param {object} opts
     * @param {string} opts.url 抓取地址
     * @param {function} opts.success 成功时回调函数
     * @param {function} opts.error 失败时回调函数
     */
    fetchPage : fetchPage
};