"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const paths_1 = require("./config/paths");
const webpack_config_dev_1 = require("./config/webpack.config.dev");
const DEFAULT_PORT = 3000;
function start() {
    console.log('start');
    const compiler = webpack(webpack_config_dev_1.default, (err, stats) => {
        console.log(err);
        console.log(stats);
    });
    const protocol = process.env.HTTPS === 'true' ? "https" : "http";
    const devServer = new WebpackDevServer(compiler, {
        compress: true,
        contentBase: paths_1.default.appPublic,
        hot: true,
        publicPath: webpack_config_dev_1.default.output.publicPath,
        quiet: true,
        // Reportedly, this avoids CPU overload on some systems.
        // https://github.com/facebookincubator/create-react-app/issues/293
        watchOptions: {
            ignored: /node_modules/
        },
        // Enable HTTPS if the HTTPS environment variable is set to 'true'
        https: protocol === "https"
    });
    devServer.listen(DEFAULT_PORT);
}
exports.start = start;
