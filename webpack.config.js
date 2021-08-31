const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: [
    './static/typescript/index.ts',
    './static/scss/index.scss',
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'static/typescript')],
        use: 'ts-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: [path.resolve(__dirname, 'static/scss')],
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    publicPath: 'dist',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static', 'dist'),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
};
