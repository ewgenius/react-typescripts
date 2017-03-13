// @remove-file-on-eject
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const fs = require('fs');
const paths = require('../../config/paths');

module.exports = (resolve, rootDir, isEjecting) => {
  // Use this instead of `paths.testsSetup` to avoid putting
  // an absolute filename into configuration after ejecting.
  const setupTestsFile = fs.existsSync(paths.testsSetup) ?
    '<rootDir>/src/setupTests.js' :
    undefined;

  // TODO: I don't know if it's safe or not to just use / as path separator
  // in Jest configs. We need help from somebody with Windows to determine this.
  const config = {
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    setupFiles: [resolve('config/polyfills.js')],
    setupTestFrameworkScriptFile: setupTestsFile,
    testPathIgnorePatterns: [
      '<rootDir>[/\\\\](build|docs|node_modules|scripts)[/\\\\]',
    ],
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
      '^.+\\.css$': resolve('config/jest/cssTransform.js'),
      '^(?!.*\\.(ts|tsx|css|json)$)': resolve('config/jest/fileTransform.js'),
    },
    testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    moduleFileExtensions: ["ts", "tsx", "js"],
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
    },
    globals: {
      "__TS_CONFIG__": "template/tsconfig.json"
    }
  };
  if (rootDir) {
    config.rootDir = rootDir;
  }
  return config;
};