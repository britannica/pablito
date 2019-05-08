const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'stickerbook.bundle.js',

  },
  plugins: [new CleanWebpackPlugin()],
  mode: 'production',

});
