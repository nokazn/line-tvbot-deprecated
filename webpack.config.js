const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'line-tvbot.js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  }
}
