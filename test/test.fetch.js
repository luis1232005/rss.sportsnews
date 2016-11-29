// view data: http://live.aicai.com/
// data source:http://live.aicai.com/jsbf/timelyscore!dynamicMatchDataForJczq.htm?dateTime=2016-11-21
// data addon:http://live.aicai.com/static/no_cache/jc/zcnew/data/hist/161121zcRefer.js
//模块载入
var F = require('../lib/pfetch');
var cheerio = require('cheerio');
var fs = require('fs');
var logger = require("../lib/loghelper").helper;

var Lottery = require('../models/Lottery');

var schedule = require("node-schedule");

//console.log(addonsMap);

function replaceFnc(str) {
    return str.replace(/^\s+|\s+$/gmi, "").replace(/\t|\r|\n/gmi, "");
}

function formatDate(date, fmt) { //author: meizz
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

function getFormatDateObj(date) {
    var now = date || new Date();
    return {
        lDateStr: formatDate(now, "yyyy-MM-dd"),
        sDateStr: formatDate(now, "yyMMdd")
    }
}

var parse_json_by_eval = function (str) {
    return eval('(' + str + ')');
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

function fetchLottery(dateObj) {
    if (!dateObj) {
        dateObj = getFormatDateObj();
    }
    //console.log(dateObj);
    if (!dateObj || !dateObj.sDateStr || !dateObj.lDateStr) {
        logger.writeErr('getFormatDateObj date error!');
        return;
    }

    //保存抓取的数据
    var fetchFormatObj = {
        fetchDate: dateObj,
        items: []
    };

    var peiLvUrl = 'http://live.aicai.com/static/no_cache/jc/zcnew/data/hist/' + dateObj.sDateStr + 'zcRefer.js';
    var gamesUrl = 'http://live.aicai.com/jsbf/timelyscore!dynamicMatchDataForJczq.htm?dateTime=' + dateObj.lDateStr;

    console.log(peiLvUrl);
    
    F.fetchPage({
        url: peiLvUrl,
        charset: 'utf-8'
    }).then(function (addonCt) {
        var peilvMaps = parse_json_by_eval(addonCt);
        console.log(peilvMaps);
    });
}

//执行

function exeFnc(){
    var now = new Date().getTime();
    var yesterday = new Date(now - 24 * 60 * 60 * 1000);
    var yesterdayObj = getFormatDateObj(yesterday);
    fetchLottery();
    //fetchLottery(yesterdayObj);
}

exeFnc();


//function scheduleRecurrenceRule(){
//
//    var rule = new schedule.RecurrenceRule();
//    // rule.dayOfWeek = 2;
//    // rule.month = 3;
//    // rule.dayOfMonth = 1;
//    // rule.hour = 1;
//    rule.minute = 58;
//    //rule.second = 0;
//
//    schedule.scheduleJob(rule, function(){
//        exeFnc();
//        logger.writeInfo("定时器开始执行一次！");
//    });
//
//}
//
//scheduleRecurrenceRule();
