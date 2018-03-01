const webpack = require('webpack');
const path = require('path');
module.exports = {
    entry: path.resolve(__dirname,'src/index.js'),
    output: {
        filename: 'index.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist/lala'
    },
    devServer: {
        hot:true,
        inline: true, // 实时刷新
        port: 3003
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};