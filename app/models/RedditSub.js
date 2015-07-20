var mongoose = require("mongoose");

var redditSubSchema = new mongoose.Schema({
    subreddit: String,
    name: String,
    link: String,
    text: String,
    createdAt: { type: Date, expires: '1h', default: Date.now }
});

module.exports = mongoose.model("RedditSub", redditSubSchema);