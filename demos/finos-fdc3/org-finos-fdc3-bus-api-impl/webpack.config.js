const path = require('path');

const nodeConfig = {
  devtool: 'source-map',
  mode: 'production',
  entry: path.resolve(__dirname, 'src-js/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.node.js',
    libraryTarget: 'umd'
  },
  target: 'node'
}

const browserConfig = {
  devtool: 'source-map',
  mode: 'production',
  entry: {
    app: './src-js/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.web.js',
    libraryTarget: 'umd'
  }
};

module.exports = [browserConfig, nodeConfig];