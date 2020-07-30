const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'none',
  stats: 'none',
  devtool: 'eval-source-map',
  plugins: [new HtmlWebpackPlugin()],
};
