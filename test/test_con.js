var mongoose = require('../lib/mongodb').mongoose;

for(var i in mongoose){
    console.log(i);
}
console.log(mongoose.connect);