const { composePlugins, withNx } = require('@nrwl/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { withReact } = require('@nrwl/react');
const { merge } = require('webpack-merge');

module.exports = composePlugins(withNx(), withReact(), (config) => {
  return merge(config, {
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    ],
  });
});
