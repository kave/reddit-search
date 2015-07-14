var mongoose = require("mongoose");
var mongoosastic = require("mongoosastic");

var linkSchema = new mongoose.Schema({
    name: {type: String, es_indexed: true},
    link: String
});

var redditSubSchema = new mongoose.Schema({
    subreddit: String,
    data: [linkSchema]
});

redditSubSchema.plugin(mongoosastic);

module.exports = mongoose.model("RedditSub", redditSubSchema);