"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const Webpack = require("webpack");
const ManifestPlugin = require("webpack-manifest-plugin");
const env_1 = require("./env");
const paths_1 = require("./paths");
const publicPath = paths_1.default.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const publicUrl = publicPath.slice(0, -1);
const env = env_1.getClientEnvironment(publicUrl);
if (env.stringified['process.env'].NODE_ENV !== '"production"') {
    throw new Error('Production builds must have NODE_ENV=production.');
}
const cssFilename = 'static/css/[name].[contenthash:8].css';
const extractTextPluginOptions = shouldUseRelativeAssetPaths
    ? { publicPath: Array(cssFilename.split('/').length).join('../') }
    : {};
const config = {
    bail: true,
    devtool: 'source-map',
    entry: [
        require.resolve('./polyfills'),
        paths_1.default.appIndexJs
    ],
    output: {
        path: paths_1.default.appBuild,
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        publicPath
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
        modules: ['node_modules'].concat(paths_1.default.nodePaths)
    },
    resolveLoader: {
        modules: [
            paths_1.default.ownNodeModules,
            paths_1.default.appNodeModules
        ]
    },
    module: {
        rules: [{
                test: /\.(ts|tsx)$/,
                enforce: 'pre',
                use: [{
                        loader: 'tslint-loader'
                    }],
                include: paths_1.default.appSrc
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
                include: paths_1.default.appSrc,
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
            template: paths_1.default.appHtml,
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
                screw_ie8: true,
                warnings: false
            },
            mangle: {
                screw_ie8: true
            },
            output: {
                comments: false,
                screw_ie8: true
            },
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
exports.default = config;
