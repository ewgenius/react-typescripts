"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autoprefixer = require("autoprefixer");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
const Webpack = require("webpack");
const env_1 = require("./env");
const paths_1 = require("./paths");
const publicPath = '/';
const publicUrl = '';
const env = env_1.getClientEnvironment(publicUrl);
const config = {
    devtool: 'cheap-module-source-map',
    entry: [
        require.resolve('react-dev-utils/webpackHotDevClient'),
        require.resolve('./polyfills'),
        paths_1.default.appIndexJs
    ],
    output: {
        filename: 'static/js/bundle.js',
        path: paths_1.default.appBuild,
        pathinfo: true,
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
                test: /\.(.+)$/,
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
            template: paths_1.default.appHtml,
        }),
        new Webpack.DefinePlugin(env.stringified),
        new Webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin(),
        new WatchMissingNodeModulesPlugin(paths_1.default.appNodeModules)
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
exports.default = config;
