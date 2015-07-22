var Snoocore = require('snoocore');
var reddit = new Snoocore({
    userAgent: 'reddit-elastic-search-debug',
    oauth: {
        type: 'explicit',
        key: process.env.REDDIT_KEY,
        secret: process.env.REDDIT_SECRET,
        redirectUri: 'http://localhost:4444/',
        scope: ['read']
    }
});

module.exports.api = reddit;
module.exports.subreddits =  ['gamedeals', 'games', 'gaming', 'pcmasterrace'];