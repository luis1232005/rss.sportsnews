// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var newsSchema = new Schema({
    title: String,
    link: String,
    description: String,
    author: String,
    pubDate: String,
    img: String,
    category:String
});

//// custom method to add string to end of name
//// you can create more important methods like name validations or formatting
//// you can also do queries and find similar users
//newsSchema.methods.dudify = function() {
//    // add some stuff to the users name
//    this.name = this.name + '-dude';
//
//    return this.name;
//};

// the schema is useless so far
// we need to create a model using it
var News = mongoose.model('News', newsSchema);

// make this available to our users in our Node applications
module.exports = News;