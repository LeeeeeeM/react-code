const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    test: path.resolve(__dirname, './src/test.js'),
    main: path.resolve(__dirname, './src/main.js')
  },
  mode: devMode ? 'development' : 'production',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            // compact: false
          }
        },
        exclude: /node_modules/
    }, {
      test: /\.scss$/,
      use: [
        devMode ? {
          loader: MiniCssExtractPlugin.loader
        } : 'style-loader' ,
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[local]'
          }
        }, 'sass-loader'
      ]
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: '8081',
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'test.html',
      inject: 'body',
      chunks: ['test']
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
      chunks: ['main']
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ]
}