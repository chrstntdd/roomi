const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleBuddyWebpackPlugin = require('bundle-buddy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Stylish = require('webpack-stylish');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ANALYZE_BUNDLE = process.env.ANALYZE_BUNDLE;
const USE_SERVICE_WORKER = process.env.USE_SW;

const { sw } = require(path.join(__dirname, 'src/client/inline-sw'));

module.exports = {
  entry: path.resolve(__dirname, 'src/client/index.tsx'),
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/main.[hash:8].js',
    chunkFilename: 'static/js/bundles/[name].[contenthash:8].chunk.js',
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
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all'
        }
      }
    },
    mergeDuplicateChunks: true,
    minimizer: [
      new TerserPlugin({
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
      packages: path.resolve(__dirname, 'src/packages/'),
      'react': path.resolve(__dirname, 'vendor/react'),
      'scheduler': path.resolve(__dirname, 'vendor/scheduler'),
      'react-dom': path.resolve(__dirname, 'vendor/react-dom'),
      'react-cache': path.resolve(__dirname, 'vendor/react-cache'),
    }
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.(ts|tsx)?$/,
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
          { loader: 'sass-loader', options: { sourceMap: true } }
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
    new MiniCssExtractPlugin({
      filename: IS_PRODUCTION ? './static/css/main.[contenthash:8].css' : '[id].css',
      chunkFilename: IS_PRODUCTION ? './static/css/[id].[contenthash:8].css' : '[id].css'
    }),
    new InterpolateHtmlPlugin({
      SW: IS_PRODUCTION && USE_SERVICE_WORKER ? sw : ''
    }),
    ...(IS_PRODUCTION
      ? [
          new PurgecssPlugin({
            paths: glob.sync(`src/client/**/*`, { nodir: true })
          })
        ]
      : []),
    new Stylish(),
    ...(ANALYZE_BUNDLE ? [new BundleBuddyWebpackPlugin()] : [])
  ]
};
