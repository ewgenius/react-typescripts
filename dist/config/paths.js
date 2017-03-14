"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const url = require("url");
const appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
    return path.resolve(appDirectory, relativePath);
}
const nodePaths = (process.env.NODE_PATH || '')
    .split(process.platform === 'win32' ? ';' : ':')
    .filter(Boolean)
    .filter((folder) => !path.isAbsolute(folder))
    .map(resolveApp);
let envPublicUrl = process.env.PUBLIC_URL;
function ensureSlash(path, needsSlash) {
    let hasSlash = path.endsWith('/');
    if (hasSlash && !needsSlash) {
        return path.substr(0, path.length - 1);
    }
    else if (!hasSlash && needsSlash) {
        return path + '/';
    }
    else {
        return path;
    }
}
function getPublicUrl(appPackageJson) {
    return envPublicUrl || require(appPackageJson).homepage;
}
function getServedPath(appPackageJson) {
    let publicUrl = getPublicUrl(appPackageJson);
    let servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
    return ensureSlash(servedUrl, true);
}
function resolveOwn(relativePath) {
    return path.resolve(__dirname, '..', relativePath);
}
let paths = {
    appBuild: resolveApp('build'),
    appHtml: resolveApp('public/index.html'),
    appIndexJs: resolveApp('src/index.js'),
    appNodeModules: resolveApp('node_modules'),
    appPackageJson: resolveApp('package.json'),
    appPath: resolveApp('.'),
    appPublic: resolveApp('public'),
    appSrc: resolveApp('src'),
    ownNodeModules: resolveOwn('node_modules'),
    ownPath: resolveOwn('.'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: getServedPath(resolveApp('package.json')),
    testsSetup: resolveApp('src/setupTests.js'),
    yarnLockFile: resolveApp('yarn.lock'),
    nodePaths
};
exports.default = paths;
