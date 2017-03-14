// import * as path from 'path';
import * as autoprefixer from 'autoprefixer';
import * as CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import * as WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import * as Webpack from 'webpack';
import { Configuration } from 'webpack';

import { getClientEnvironment } from './env';
import paths from './paths';

const publicPath = '/';
const publicUrl = '';
const env = getClientEnvironment(publicUrl);

const config: Configuration = {
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('./polyfills'),
    paths.appIndexJs
  ],
  output: {
    filename: 'static/js/bundle.js',
    path: paths.appBuild,
    pathinfo: true,
    publicPath
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
    modules: ['node_modules'].concat(paths.nodePaths)
  },
  resolveLoader: {
    modules: [
      paths.ownNodeModules,
      paths.appNodeModules
    ]
  },
  module: {
    rules: [{
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        use: [{
          loader: 'tslint-loader'
        }],
        include: paths.appSrc
      }, {
        test: /\(.*)$/,
        exclude: [
          /\.html$/,
          /\.(ts|tsx)$/,
          /\.css$/,
          /\.scss$/,
          /\.json$/,
          /\.svg$/
        ],
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }, {
        test: /\.(ts|tsx)$/,
        include: paths.appSrc,
        loader: 'ts-loader'
      }, {
        test: /\.css$/,
        use: [
          'style-loader', {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }, {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [autoprefixer({
                browsers: [
                  '>1%',
                  'last 4 versions',
                  'Firefox ESR',
                  'not ie < 9',
                ]
              })]
            }
          }
        ]
      }, {
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new Webpack.DefinePlugin(env.stringified),
    new Webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  performance: {
    hints: false
  }
};

export default config;
