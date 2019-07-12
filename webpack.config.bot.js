var path = require('path');
module.exports = {
    entry: './out/bot.js',
    output: {
        filename: 'bot_bundle.js',
        path: path.resolve(__dirname, 'out')
    }
};