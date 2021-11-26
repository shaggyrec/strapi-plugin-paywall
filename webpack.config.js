const path = require('path');

module.exports = {
  entry: './src/paywall.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'paywall.js',
    path: path.resolve(__dirname, 'public'),
  },
};