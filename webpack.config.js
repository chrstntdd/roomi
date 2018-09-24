const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Stylish = require('webpack-stylish');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  entry: path.resolve(__dirname, 'src/client/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './static/js/main.[hash:8].js',
    chunkFilename: './static/js/bundles/[name].[contenthash:8].chunk.js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },

  devServer: {
    compress: true,
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    useLocalIp: true,
    host: '0.0.0.0',
    overlay: {
      warnings: true,
      errors: true
    }
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    mergeDuplicateChunks: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src/client/'),
      packages: path.resolve(__dirname, 'src/packages/')
    }
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.ts(x?)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [{ loader: 'awesome-typescript-loader', options: { transpileOnly: true } }]
      },

      // All output '.js' files will have any sourcemaps re-processed by 'sourceyarn -map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      title: 'Roomi',
      minify: IS_PRODUCTION && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new HardSourceWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: IS_PRODUCTION ? './static/css/main.[contenthash:8].css' : '[id].css',
      chunkFilename: IS_PRODUCTION ? './static/css/[id].[contenthash:8].css' : '[id].css'
    }),
    new Stylish()
  ]
};
