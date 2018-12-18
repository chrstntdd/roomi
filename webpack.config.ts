const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const InterpolateHtmlPlugin = require('interpolate-html-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzer = require('webpack-bundle-analyzer')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const Stylish = require('webpack-stylish')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const ANALYZE_BUNDLE = process.env.ANALYZE_BUNDLE
const USE_SERVICE_WORKER = process.env.USE_SW

const { sw } = require(path.join(__dirname, 'src/client/inline-sw'))

module.exports = {
  mode: IS_PRODUCTION ? 'production' : 'development',

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

  ...(IS_PRODUCTION && { devtool: 'source-map' }),

  ...(IS_PRODUCTION && {
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all'
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              // we want terser to parse ecma 8 code. However, we don't want it
              // to apply any minfication steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending futher investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
              dead_code: true,
              pure_funcs: [
                '_elm_lang$core$Native_Utils.update',
                'A2',
                'A3',
                'A4',
                'A5',
                'A6',
                'A7',
                'A8',
                'A9',
                'F2',
                'F3',
                'F4',
                'F5',
                'F6',
                'F7',
                'F8',
                'F9'
              ],
              pure_getters: true,
              keep_fargs: false,
              unsafe_comps: true,
              unsafe: true
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 6,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true
            }
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    }
  }),

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.elm'],

    alias: {
      '@': path.resolve(__dirname, 'src/client/'),
      packages: path.resolve(__dirname, 'src/packages/'),
      react: path.resolve(__dirname, 'vendor/react'),
      scheduler: path.resolve(__dirname, 'vendor/scheduler'),
      'react-dom': path.resolve(__dirname, 'vendor/react-dom'),
      'react-cache': path.resolve(__dirname, 'vendor/react-cache')
    }
  },

  module: {
    noParse: /\.elm$/,

    rules: [
      {
        test: /\.elm$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: require.resolve('elm-webpack-loader'),
            options: {
              pathToElm: path.resolve(__dirname, 'node_modules/.bin/elm'),
              runtimeOptions: ['-A128M', '-H128M', '-n8m'],
              ...(IS_PRODUCTION ? { optimize: IS_PRODUCTION } : { debug: true, forceWatch: true })
            }
          }
        ]
      },

      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: []
      },

      {
        test: /\.(ts|tsx)?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [{ loader: 'awesome-typescript-loader', options: { transpileOnly: true } }]
      },

      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader',
          { loader: 'css-loader', options: { modules: true } },
          'postcss-loader',
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },

  plugins: [
    new Stylish(),

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

    ...(ANALYZE_BUNDLE ? [new BundleAnalyzer()] : [])
  ],

  node: {
    fs: 'empty',
    net: 'empty'
  },

  performance: {
    hints: false
  }
}
