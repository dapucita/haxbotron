var path = require('path');
module.exports = {
    entry: './bot.js',
    output: {
        filename: 'bot_bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};