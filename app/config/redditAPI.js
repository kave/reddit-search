var Snoocore = require('snoocore');
var reddit = new Snoocore({
    userAgent: 'reddit-elastic-search-debug',
    oauth: {
        type: 'explicit',
        key: 'rffsox3_05QgRw',
        secret: 'fNEULM0mltK2CKk1sWXU_BrEbmE',
        redirectUri: 'http://localhost:4444/',
        scope: ['read']
    }
});

module.exports.api = reddit;
module.exports.subreddits =  ['gamedeals', 'games', 'gaming', 'pcmasterrace'];