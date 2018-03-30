const webpack = require('webpack')
const path = require('path')

const mode = process.env.NODE_ENV || 'development'

const plugins = []
let devtool = false
if (mode !== 'production') {
  plugins.push(new webpack.HotModuleReplacementPlugin())
  devtool = 'source-map'
}

const config = {
  mode,
  target: 'electron-renderer',
  entry: (process.env.NODE_ENV === 'production'
    ? []
    : [
        'webpack-hot-middleware/client?reload=true&path=http://localhost:9000/__webpack_hmr',
      ]
  ).concat(['./src/index']),
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(png|woff)$/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  output: {
    path: path.resolve('electron', 'build'),
    publicPath: 'http://localhost:9000/dist/',
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      connector: path.resolve('connector', 'index.js'),
    },
  },
  plugins,
  devtool,
}

module.exports = config
