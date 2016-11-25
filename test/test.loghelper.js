//在app.js中添加以下代码, 以便在日志中输出url请求，由于加载顺序的原因，放在其他app.use前面
//var app = express();
//var log = require('./logHelper');
//log.use(app);

var logger = require("../lib/loghelper").helper;
logger.writeInfo("哈哈1开始记录日志");
logger.writeErr("出错了，你怎么搞的");
