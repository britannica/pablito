const webpack = require('webpack');

module.exports = {
  entry: {
    es: './src/index',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        type: 'javascript/esm',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])],
  externals: {
    'canvas-prebuilt': 'undefined',
    canvas: 'undefined',
    'jsdom/lib/jsdom/utils': JSON.stringify({ Canvas: null }),
    'jsdom/lib/jsdom/living/generated/utils': JSON.stringify({ implForWrapper: null }),
    jsdom: 'null',
    xmldom: JSON.stringify({ DOMParser: null }),
  }
};
