const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/main.js'),
    component: path.resolve(__dirname, './src/component.js')
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
      filename: 'index.html',
      inject: 'body',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'component.html',
      inject: 'body',
      chunks: ['component']
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ]
}