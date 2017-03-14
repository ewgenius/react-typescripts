import * as autoprefixer from 'autoprefixer';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import * as Webpack from 'webpack';
import { Configuration } from 'webpack';
import * as ManifestPlugin from 'webpack-manifest-plugin';

import { getClientEnvironment } from './env';
import paths from './paths';

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

const cssFilename = 'static/css/[name].[contenthash:8].css';

const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? { publicPath: Array(cssFilename.split('/').length).join('../') }
  : {};

const config: Configuration = {
  bail: true,
  devtool: 'source-map',
  entry: [
    require.resolve('./polyfills'),
    paths.appIndexJs
  ],
  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
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
      loader: ExtractTextPlugin.extract(Object.assign({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }, {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (): any[] => [autoprefixer({
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
      }, extractTextPluginOptions))
      // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
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
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
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
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    new Webpack.DefinePlugin(env.stringified),
    // Minify the code.
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      } as any,
      sourceMap: true
    }),
    new ExtractTextPlugin({
      filename: cssFilename
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    })
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
};

export default config;
