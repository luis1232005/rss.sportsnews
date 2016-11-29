// view data: http://live.aicai.com/
// data source:http://live.aicai.com/jsbf/timelyscore!dynamicMatchDataForJczq.htm?dateTime=2016-11-21
// data addon:http://live.aicai.com/static/no_cache/jc/zcnew/data/hist/161121zcRefer.js
//模块载入
var F = require('../lib/pfetch');
var cheerio = require('cheerio');
var fs = require('fs');
var util = require("../lib/util");
var logger = require("../lib/loghelper").helper;
var Lottery = require('../models/Lottery');
var Q = require('q');


function getFormatDateObj(date) {
    var now = date || new Date();
    return {
        lDateStr: util.dateFormat(now, "yyyy-MM-dd"),
        sDateStr: util.dateFormat(now, "yyMMdd")
    }
}

function formatName(name) {
    var matchs = name.match(/\](.*)\[|\d+(.*)\d+/gi);
    var score = '';
    var scoreMaths = null;
    var home = '';
    var guest = '';

    var ifWc = !!(name.indexOf('完场') > -1);

    if (matchs && matchs[0]) {
        var tempStr = matchs[0];
        if (/\d:\d/gi.test(tempStr)) {
            scoreMaths = tempStr.match(/\d:\d/gi);
            score = (scoreMaths && scoreMaths[0]) || '';
        }

        tempStr = tempStr.replace(/\d|\[|\]|^\d+|\d+$/gi, "").replace(":", "VS");
        home = tempStr.split("VS")[0];
        guest = tempStr.split("VS")[1];

        return {
            name: tempStr,
            home: home,
            guest: guest,
            score: score,
            finish: ifWc
        }
    } else {
        if (name.indexOf('VS') > -1) {
            matchs = name.match(/00(.*)00/gi);
            tempStr = (matchs && matchs[0]) || '';
            tempStr = tempStr.replace(/00/gi, '');
            home = tempStr.split("VS")[0];
            guest = tempStr.split("VS")[1];

            return {
                name: tempStr,
                home: home,
                guest: guest,
                score: ''
            }
        } else {
            return null;
        }
    }
}

function formatGameInfo(cts) {
    try {
        var peilvMaps = util.parseJsonByEval(cts[0]);
        var ctObj = JSON.parse(cts[1]);
        var html = "";
        var resultGames = [];

        if (ctObj.status && ctObj.status == "success" && ctObj.result && ctObj.result.jsbf_matchs) {
            html = ctObj.result.jsbf_matchs;
            var $ = cheerio.load(html);

            $(".tbody_body tr").each(function () {

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
                var finish = false;//是否完场

                var $tds = $("td", this);

                id = $tds.eq(0).find(".jq_selectmatch").eq(0).attr("id");
                id = id.replace('jq_', '');

                saishi = util.replaceFnc($tds.eq(2).text());
                playDate = util.replaceFnc($tds.eq(3).text()).substr(0, 11);
                tempName = util.replaceFnc($tds.eq(4).text());
                playModes = $tds.eq(6).text();
                addonsTemp = $tds.eq(7).text();

                nameObj = formatName(tempName);

                //console.log(tempName);

                if (nameObj) {
                    name = (nameObj && nameObj.name) || '';
                    home = (nameObj && nameObj.home) || '';
                    guest = (nameObj && nameObj.guest) || '';
                    score = (nameObj && nameObj.score) || '';
                    finish = nameObj.finish;
                }

                //抓取赔率
                if (peilvMaps && id && peilvMaps[id] && peilvMaps[id].sp) {
                    rqAddons = peilvMaps[id].sp.jczq_spf_gd.replace(/-/gi, '|');
                    noRqAddons = peilvMaps[id].sp.jczq_xspf_gd.replace(/-/gi, '|');
                }
                //console.log(playModes,rqAddons,noRqAddons);

                var temResult = -10000;
                if (score) {
                    temResult = parseInt(score.split(':')[0]) - parseInt(score.split(':')[1]);
                }
                //console.log(name + "_"+ new Date().getFullYear() + "-" + playDate);

                resultGames.push({
                    saishi: saishi,
                    id: id,
                    finish: finish,
                    name: home + "VS" + guest,//对战名称
                    home: home,//主队名称
                    guest: guest,//客队名称
                    result: temResult,//结果
                    score: score,//比分
                    play: [{
                        playType: '1',//玩法 '1'：不让球玩法，'2'：让球玩法
                        odds: noRqAddons,//对应赔率
                        concedePoint: 0,//让几球
                        result: temResult
                    }, {
                        playType: '2',//玩法 '1'：不让球玩法，'2'：让球玩法
                        odds: rqAddons,//对应赔率
                        concedePoint: parseInt(playModes),//让几球
                        result: (temResult == -10000) ? temResult : ( temResult + parseInt(playModes))
                    }],
                    playDate: new Date(playDate),
                    playDateStr: new Date().getFullYear() + "-" + playDate,
                    updateDate: new Date(),
                    createDate: new Date()
                });
            });
        }

        return resultGames;
    } catch (err) {
        logger.writeInfo("解析信息失败，错误" + (err.message || ''));
        return null;
    }
}

//包装成promise
function lotterySave(item,callback){
    var deferred = Q.defer();
    Lottery.findOneById(item.id, function (err, findItem) {
        if (err) {
            logger.writeErr('opt db findOneById is error' + (err.message||'') );
            deferred.reject(err);
            return;
        }

        if (!findItem) {
            Lottery.save(item, function (err) {
                if (err) {
                    logger.writeErr('opt db save is error' + (err.message||'') );
                    deferred.reject(err);
                    return;
                }

                deferred.resolve(item);
                logger.writeInfo(item.id + "save sucess!");
            });
        } else {
            if (findItem.id && findItem.id == item.id && !findItem.finish && item.result != -10000) {

                findItem.finish = item.finish;
                findItem.score = item.score;
                findItem.result = item.result;
                findItem.play[0].odds = item.play[0].odds;
                findItem.play[0].result = item.play[0].result;

                findItem.play[1].odds = item.play[1].odds;
                findItem.play[1].concedePoint = item.play[1].concedePoint;
                findItem.play[1].result = item.play[1].result;

                findItem.updateDate = new Date();

                findItem.save(function(err){
                    if(err){
                        logger.writeErr('opt db save is error' + (err.message||'') );
                        deferred.reject(err);
                        return;
                    }

                    deferred.resolve(item);
                    logger.writeInfo(item.id + "save sucess!");
                });
            }else{
                deferred.resolve(item);
                logger.writeWarn(item.id+ "-on use update!");
            }
        }
    });

    return deferred.promise.nodeify(callback);
}

function lotterySaveAll(items){
    var lotterySaveAry = [];

    items.forEach(function(item){
        lotterySaveAry.push(lotterySave(item));
    });
    return Q.all(lotterySaveAry);
}

function fetchLottery(dateObj) {
    if (!dateObj) {
        dateObj = getFormatDateObj();
    }
    //console.log(dateObj);
    if (!dateObj || !dateObj.sDateStr || !dateObj.lDateStr) {
        logger.writeErr('getFormatDateObj date error!');
        return;
    }

    var peiLvUrl = 'http://live.aicai.com/static/no_cache/jc/zcnew/data/hist/' + dateObj.sDateStr + 'zcRefer.js';
    var gamesUrl = 'http://live.aicai.com/jsbf/timelyscore!dynamicMatchDataForJczq.htm?dateTime=' + dateObj.lDateStr;

    F.createPromiseList([{url: peiLvUrl}, {url: gamesUrl}])
        .then(function (cts) {
            var items = null;
            if (cts[0] && cts[1]) {
                items = formatGameInfo(cts);
            }
            return items;
        })
        .then(lotterySaveAll)
        .then(function(items){
            //console.log(items.length);
        })
        .catch(function (err) {
            logger.writeErr('promise err,'+ (err.message || ""));
        })
        .done(function () {
            process.exit();
        });
}

fetchLottery();
