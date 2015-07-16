var mongoose = require("mongoose");

var redditSubSchema = new mongoose.Schema({
    subreddit: String,
    name: String,
    link: String,
    createdAt: { type: Date, expires: '1d', default: Date.now }
});

module.exports = mongoose.model("RedditSub", redditSubSchema);