import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import paths from './config/paths';
import config from './config/webpack.config.dev';

const DEFAULT_PORT = 3000;

export function start() {
  console.log('start');

  const compiler = webpack(config, (err, stats) => {
    console.log(err);
    console.log(stats);
  }) as webpack.Compiler;

  const protocol = process.env.HTTPS === 'true' ? "https" : "http";

  const devServer = new WebpackDevServer(compiler, {
    compress: true,
    contentBase: paths.appPublic,
    hot: true,
    publicPath: config.output.publicPath,
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
