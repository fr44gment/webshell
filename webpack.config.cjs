const path = require('path');

module.exports = {
    'mode': 'development',
    'entry': {
        'main': './dist/client/main.js',
    },
    'devtool': 'source-map',
    'stats': 'errors-only',
    'output': {
        'path': path.resolve(__dirname, './public/js/'),
        'publicPath': '/js/',
        'filename': '[name].js',
    },
    'resolve': {
        'extensions': ['.ts', '.js', '.tsx', '.jsx'],
        'alias': {
            '@page': path.resolve(__dirname, './dist/client/app/page'),
            '@shared': path.resolve(__dirname, './dist/client/app/shared'),
            '@class': path.resolve(__dirname, './dist/client/class'),
        },
    },
};