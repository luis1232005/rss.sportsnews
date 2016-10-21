/**
 * Created by liu.liang on 2016/3/25.
 * 获得当天比赛并保存
 */
var fetch = require('../lib/fetch');
var cheerio = require('cheerio');

function writeFile(path,ct){
    var fs = require('fs');
    fs.writeFile(path,ct, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

fetch.getHtml({
    url: 'http://www.woying.com/jingcai/hunhe/',
    success: function(html){
        var $ = cheerio.load(html);

        var items = [];
        $('.alltrObj').each(function(){
            items.push({
                id: $(this).attr('matchid'),
                ls: $('.ls',this).text(),
                name: $('.huihname',this).text()
            });
        });

        var dStr = new Date().getFullYear() + '_' + new Date().getMonth() + '_'+new Date().getDate();

        writeFile("../database/"+ dStr + "-" +"games.txt",JSON.stringify(items));
        //items.forEach(function(id){
        //    fetch.getHtml({
        //        url:  'http://www.woying.com/together/scheme_info/'+ id ,
        //        success: function(res){
        //            var reg = /var\s+spdObj\s+=(.*)]}}}];/g;
        //            var result = res.match(reg);
        //
        //            //console.log(id,result[0]);
        //            writeFile("../database/"+ dStr + "-" + id + ".txt",result[0]);
        //        },
        //        error:function(){
        //
        //        }
        //    });
        //});
        ////console.log(items.length);
    },
    error: function(){

    }
});