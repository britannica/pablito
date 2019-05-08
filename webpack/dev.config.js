const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  watch: true,
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, '../demo'),
    port: 9000,
  },
  output: {
    path: path.resolve(__dirname, '../demo'),
    filename: './stickerbook.dev.bundle.js',
    library: 'Pablito'
  },
});