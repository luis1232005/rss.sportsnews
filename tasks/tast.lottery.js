// view data: http://live.aicai.com/
// data source:http://live.aicai.com/jsbf/timelyscore!dynamicMatchDataForJczq.htm?dateTime=2016-11-21
// data addon:http://live.aicai.com/static/no_cache/jc/zcnew/data/hist/161121zcRefer.js
//模块载入
var F = require('../lib/pfetch');
var cheerio = require('cheerio');
var Q = require('q');
var fs = require('fs');
var parser = require('json-parser');

var Lottery = require('../models/Lottery');

//console.log(addonsMap);

function replaceFnc(str){
    return str.replace(/^\s+|\s+$/gmi,"").replace(/\t|\r|\n/gmi,"");
}

function formatDate(date,fmt) { //author: meizz
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getFormatDateObj(){
    var now = new Date();
    return {
        lDateStr: formatDate(now,"yyyy-MM-dd"),
        sDateStr: formatDate(now,"yyMMdd")
    }
}

var parse_json_by_eval = function(str){
    return eval('('+str+')');
}

function formatName(name){
    var matchs = name.match(/\](.*)\[/gi);
    var score = '';
    var scoreMaths = null;
    var home = '';
    var guest = '';

    if(matchs && matchs[0]){
        var tempStr = matchs[0];
        if(/\d:\d/gi.test(tempStr)){
            scoreMaths = tempStr.match(/\d:\d/gi);
            score = (scoreMaths && scoreMaths[0]) || '';
        }

        tempStr = tempStr.replace(/\d|\[|\]/gi,"").replace(":","VS");
        home = tempStr.split("VS")[0];
        guest = tempStr.split("VS")[1];

        return {
            name : tempStr,
            home : home,
            guest : guest,
            score : score
        }
    }else{
        if(name.indexOf('VS')>-1){
            matchs = name.match(/00(.*)00/gi);
            tempStr = (matchs && matchs[0]) || '';
            tempStr = tempStr.replace(/00/gi,'');
            home = tempStr.split("VS")[0];
            guest = tempStr.split("VS")[1];

            return {
                name : tempStr,
                home : home,
                guest : guest,
                score : ''
            }
        }else{
            return null;
        }
    }
}

function fetchLottery(dateObj){
    if(!dateObj){
        dateObj = getFormatDateObj();
    }
    //console.log(dateObj);
    if(!dateObj || !dateObj.sDateStr || !dateObj.lDateStr){
        //todo:抓取错误
        return ;
    }

    //保存抓取的数据
    var fetchFormatObj = {
        fetchDate: dateObj,
        items: []
    };

    F.fetchPage({
        url:'http://live.aicai.com/static/no_cache/jc/zcnew/data/hist/'+ dateObj.sDateStr +'zcRefer.js',
        charset: 'utf-8'
    }).then(function(addonCt){
        try{
            var peilvMaps = parse_json_by_eval(addonCt);

            F.fetchPage({
                url: 'http://live.aicai.com/jsbf/timelyscore!dynamicMatchDataForJczq.htm?dateTime='+ dateObj.lDateStr
            }).then(function(ct){
                try{
                    var ctObj = JSON.parse(ct);
                    var html = "";
                    if(ctObj.status && ctObj.status == "success" && ctObj.result && ctObj.result.jsbf_matchs){
                        html = ctObj.result.jsbf_matchs;
                        var $ = cheerio.load(html);

                        var item = null;
                        var nameObj = null;
                        var tempName = '';
                        var playModes = '';
                        var addonsTemp = '';
                        var id = '';

                        var saishi = '';
                        var playDate = '';
                        var name = '';
                        var home = '';
                        var guest = '';
                        var score = '';
                        var rqAddons = '';//让球赔率
                        var noRqAddons = '';//不让球赔率

                        $(".tbody_body tr").each(function(){
                            var $tds = $("td",this);

                            id = $tds.eq(0).find(".jq_selectmatch").eq(0).attr("id");
                            id = id.replace('jq_','');

                            saishi = replaceFnc($tds.eq(2).text());
                            playDate = replaceFnc($tds.eq(3).text()).substr(0,11);
                            tempName = replaceFnc($tds.eq(4).text());
                            playModes = $tds.eq(6).text();
                            addonsTemp = $tds.eq(7).text();

                            nameObj = formatName(tempName);

                            if(nameObj){
                                name = (nameObj && nameObj.name) || '';
                                home = (nameObj && nameObj.home) || '';
                                guest = (nameObj && nameObj.guest) || '';
                                score = (nameObj && nameObj.score) || '';
                            }

                            //抓取赔率
                            if(peilvMaps && id && peilvMaps[id] && peilvMaps[id].sp){
                                rqAddons = peilvMaps[id].sp.jczq_spf_gd.replace(/-/gi,'|');
                                noRqAddons = peilvMaps[id].sp.jczq_xspf_gd.replace(/-/gi,'|');
                            }
                            //console.log(playModes,rqAddons,noRqAddons);

                            var temResult = -10000;
                            if(score){
                                temResult = parseInt(score.split(':')[0]) - parseInt(score.split(':')[1]);
                            }
                            //console.log(name + "_"+ new Date().getFullYear() + "-" + playDate);

                            fetchFormatObj.items.push({
                                saishi: saishi,
                                name: name + "_"+ new Date().getFullYear() + "-" + playDate,//对战名称
                                home: home,//主队名称
                                guest: guest,//客队名称
                                result: temResult,//结果
                                score: score,//比分
                                play: [{
                                    playType: '1',//玩法 '1'：不让球玩法，'2'：让球玩法
                                    odds: noRqAddons,//对应赔率
                                    concedePoint: 0,//让几球
                                    result: temResult
                                },{
                                    playType: '2',//玩法 '1'：不让球玩法，'2'：让球玩法
                                    odds: rqAddons,//对应赔率
                                    concedePoint: parseInt(playModes),//让几球
                                    result: (temResult == -10000) ? temResult: ( temResult + parseInt(playModes))
                                }],
                                playDate: new Date(playDate),
                                playDateStr: new Date().getFullYear() + "-" + playDate,
                                updateDate: new Date(),
                                createDate: new Date()
                            });

                            //console.log(id,parseInt(playModes),name,home,guest,score, rqAddons,temResult,noRqAddons,rqAddons);

                        });



                        fetchFormatObj.items.forEach(function(item){
                           // console.log(item.name + "_" + item.playDate);
                            Lottery.findByName(item.name,function(err,items){
                                if(err){
                                    //todo:记录日志
                                    return;
                                }
                                //console.log(item.name + "_" + item.playDateStr,items.length);
                                if(items.length<=0){
                                    Lottery.save(item,function(err){
                                        if(err){
                                            //todo:记录日志
                                            console.log(err);
                                            return;
                                        }

                                        console.log('save sucess');
                                    });
                                }
                            });
                        });

                        //console.log(fetchFormatObj.items.length);
                    }else{
                        //todo:错误日志
                        console.log(e);
                    }
                }catch(e){
                    //todo:记录抓取失败
                    console.log(e);
                }
            });
        }catch(e){
            console.log(e);
            //todo:记录抓取失败
        }
    });
}

//执行
fetchLottery();