var random_useragent = require('random-useragent');
console.log(random_useragent.getRandom(function (ua) {
    return ua.deviceType === 'mobile' && ua.deviceModel === "iPhone" || ua.browserName === "Android Browser";
}));
