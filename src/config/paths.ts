import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath: string) {
  return path.resolve(appDirectory, relativePath);
}

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

function resolveOwn(relativePath: string) {
  return path.resolve(__dirname, '..', relativePath);
}

let paths = {
  appBuild: resolveApp('build'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.tsx'),
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
  nodePaths
};

export default paths;
