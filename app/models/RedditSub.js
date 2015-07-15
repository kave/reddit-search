var mongoose = require("mongoose");

var redditSubSchema = new mongoose.Schema({
    subreddit: String,
    name: String,
    link: String
});

module.exports = mongoose.model("RedditSub", redditSubSchema);