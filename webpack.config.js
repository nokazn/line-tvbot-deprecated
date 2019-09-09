const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname),
    filename: './dist/index.js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js']
  },
  externals: {
    canvas: 'commonjs canvas'
  },
}
