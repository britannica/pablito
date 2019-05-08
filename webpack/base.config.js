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
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ],
  },
  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])]
};
