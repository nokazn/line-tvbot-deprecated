const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname),
    filename: './dist/index.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts']
  },
  externals: {
    canvas: 'commonjs canvas'
  },
}
