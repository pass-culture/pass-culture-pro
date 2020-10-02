const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const getClientEnvironment = require('./env')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const path = require('path')
const paths = require('./paths')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack')

const publicPath = '/'
const publicUrl = ''
const env = getClientEnvironment(publicUrl)

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    'react-hot-loader/patch',
    require.resolve('./polyfills'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    paths.appIndexJs,
  ],
  mode: 'development',
  output: {
    pathinfo: true,
    filename: 'static/js/[name].bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    modules: [paths.appPath, 'node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter)
        .filter(s => s !== '')
        .concat('src')
        .join(path.delimiter)
    ),
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx', 'ts', 'tsx'],
    alias: {
      'react-native': 'react-native-web',
    },
    plugins: [new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(t|j)sx?$/,
        enforce: 'pre',
        use: [
          {
            options: {
              cache: true,
              emitError: false,
              emitWarning: true,
              eslintPath: require.resolve('eslint'),
              failOnError: false,
              failOnWarning: false,
              formatter: eslintFormatter,
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ttf$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(ts|js)x?$/,
            include: paths.appSrc,
            exclude: /node_modules/,
            use: {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
                cacheDirectory: false,
                presets: [
                  [
                    "@babel/preset-env",
                    { targets: "react-app" } // or whatever your project requires
                  ],
                  "@babel/preset-typescript",
                  "@babel/preset-react"
                ],
                plugins: [
                  ["@babel/plugin-proposal-class-properties", { loose: true }],
                  "react-hot-loader/babel"
                ]
              },
            }
          },
          {
            test: /\.s?css$/,
            loaders: ['style-loader', 'css-loader', 'sass-loader'],
          },
        ].concat([
          {
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ]),
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ForkTsCheckerWebpackPlugin(),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: {
    hints: false,
  },
}
