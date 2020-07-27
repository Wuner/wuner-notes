const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          esModule: false,
          name: 'imgs/[name].[hash:4].[ext]',
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:4].[ext]',
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:4].[ext]',
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      BASE_URL: 'public/',
      inject: true,
      template: 'public/index.html',
    }),
    new VueLoaderPlugin(), // vue loader 15 必须添加plugin
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: 'public',
        },
      ],
    }),
  ],
};
