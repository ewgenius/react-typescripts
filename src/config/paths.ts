import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath: string) {
  return path.resolve(appDirectory, relativePath);
}

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.

// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders

// We will export `nodePaths` as an array of absolute paths.
// It will then be used by Webpack configs.
// Jest doesn’t need this because it already handles `NODE_PATH` out of the box.

// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421

const nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .filter((folder: string) => !path.isAbsolute(folder))
  .map(resolveApp);

let envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path: string, needsSlash: boolean) {
  let hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(0, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return path + '/';
  } else {
    return path;
  }
}

function getPublicUrl(appPackageJson: string) {
  return envPublicUrl || require(appPackageJson).homepage;
}

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson: string) {
  let publicUrl = getPublicUrl(appPackageJson);
  let servedUrl = envPublicUrl || (
    publicUrl ? url.parse(publicUrl).pathname : '/'
  );
  return ensureSlash(servedUrl, true);
}

export interface IPaths {
  appBuild: string;
  appHtml: string;
  appIndexJs: string;
  appNodeModules: string;
  appPackageJson: string;
  appPublic: string;
  appPath?: string;
  appSrc: string;
  ownNodeModules?: string;
  ownPath?: string;
  publicUrl: string;
  servedPath: string;
  testsSetup: string;
  yarnLockFile: string;
  nodePaths: string;
}

// config after eject: we're in ./config/
let paths: IPaths = {
  appBuild: resolveApp('build'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appNodeModules: resolveApp('node_modules'),
  appPackageJson: resolveApp('package.json'),
  appPublic: resolveApp('public'),
  appSrc: resolveApp('src'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  testsSetup: resolveApp('src/setupTests.js'),
  yarnLockFile: resolveApp('yarn.lock'),
  nodePaths,
};

// @remove-on-eject-begin
function resolveOwn(relativePath: string) {
  return path.resolve(__dirname, '..', relativePath);
}

// config before eject: we're in ./node_modules/react-scripts/config/
paths = {
  appBuild: resolveApp('build'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appNodeModules: resolveApp('node_modules'),
  appPackageJson: resolveApp('package.json'),
  appPath: resolveApp('.'),
  appPublic: resolveApp('public'),
  appSrc: resolveApp('src'),
  ownNodeModules: resolveOwn('node_modules'), // This is empty on npm 3
  ownPath: resolveOwn('.'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  testsSetup: resolveApp('src/setupTests.js'),
  yarnLockFile: resolveApp('yarn.lock'),
  nodePaths,
};

const ownPackageJson = require('../../package.json');
let reactScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);
let reactScriptsLinked = fs.existsSync(reactScriptsPath) && fs.lstatSync(reactScriptsPath).isSymbolicLink();

// config before publish: we're in ./packages/react-scripts/config/
if (!reactScriptsLinked && __dirname.indexOf(path.join('packages', 'react-scripts', 'config')) !== -1) {
  paths = {
    appBuild: resolveOwn('../../build'),
    appHtml: resolveOwn('template/public/index.html'),
    appIndexJs: resolveOwn('template/src/index.js'),
    appNodeModules: resolveOwn('node_modules'),
    appPackageJson: resolveOwn('package.json'),
    appPath: resolveApp('.'),
    appPublic: resolveOwn('template/public'),
    appSrc: resolveOwn('template/src'),
    ownNodeModules: resolveOwn('node_modules'),
    ownPath: resolveOwn('.'),
    publicUrl: getPublicUrl(resolveOwn('package.json')),
    servedPath: getServedPath(resolveOwn('package.json')),
    testsSetup: resolveOwn('template/src/setupTests.js'),
    yarnLockFile: resolveOwn('template/yarn.lock'),
    nodePaths,
  };
}
// @remove-on-eject-end

export default paths;
