/**
 * 公用函数
 * @moudle util
 */

/**
 * 格式化日期
 * @method dateForamt
 * @param {datetime} date 日期
 * @param {string} fmt 格式化字符串，如：'yyyy-MM-dd'、'yyyy-MM-dd hh:mm:ss'
 * @returns {string}
 */
function dateFormat(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o){
        if (new RegExp("(" + k + ")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
}

/**
 * 去除换行及字符串首尾空白
 * @param str
 * @returns {XML|string}
 */
function replaceFnc(str) {
    return str.replace(/^\s+|\s+$/gmi, "").replace(/\t|\r|\n/gmi, "");
}

/**
 * 通过eval方式格式化参数
 * @param str
 * @returns {Object}
 */
function parseJsonByEval(str) {
    return eval('(' + str + ')');
}

function getWeekIndexByName(week) {
    var weekArr = ['周一','周二','周三','周四','周五','周六','周日'];
    for (var i=0; i<weekArr.length; i++) {
        if (weekArr[i] == week) {
            return i+1;
            break;
        }
    }
}


//输出
module.exports = {
    dateFormat : dateFormat,
    parseJsonByEval: parseJsonByEval,
    replaceFnc: replaceFnc,
    getWeekIndexByName: getWeekIndexByName,
};
