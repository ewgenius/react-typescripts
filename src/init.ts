import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

export function init(
  appPath: string,
  appName: string,
  verbose: boolean,
  originalDirectory: string,
  template: string) {
  const ownPackageName = require(path.join(__dirname, '..', 'package.json')).name;
  const ownPath = path.join(appPath, 'node_modules', ownPackageName);
  const appPackage = require(path.join(appPath, 'package.json'));
  const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));

  appPackage.dependencies = appPackage.dependencies || {};
  appPackage.devDependencies = appPackage.devDependencies || {};

  appPackage.scripts = {
    build: 'react-typescripts build',
    eject: 'react-typescripts eject',
    start: 'react-typescripts start',
    test: 'react-typescripts test --env=jsdom',
  };

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2),
  );

  // Copy the files for the user
  const templatePath = template ? path.resolve(originalDirectory, template) : path.join(ownPath, 'template');
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
  } else {
    console.error('Could not locate supplied template: ' + chalk.green(templatePath));
    return;
  }

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  fs.move(path.join(appPath, 'gitignore'), path.join(appPath, '.gitignore'), [], (err: any) => {
    if (err) {
      // Append if there's already a `.gitignore` file there
      if (err.code === 'EEXIST') {
        const data = fs.readFileSync(path.join(appPath, 'gitignore'));
        fs.appendFileSync(path.join(appPath, '.gitignore'), data);
        fs.unlinkSync(path.join(appPath, 'gitignore'));
      } else {
        throw err;
      }
    }
  });

  let command;
  let args;

  if (useYarn) {
    command = 'yarnpkg';
    args = ['add'];
  } else {
    command = 'npm';
    args = [
      'install',
      '--save',
      verbose && '--verbose',
    ].filter((e) => e);
  }
  args.push('react', 'react-dom');

  // Install additional template dependencies, if present
  const templateDependenciesPath = path.join(appPath, '.template.dependencies.json');
  if (fs.existsSync(templateDependenciesPath)) {
    const templateDependencies = require(templateDependenciesPath).dependencies;
    args = args.concat(Object.keys(templateDependencies).map((key) => {
      return key + '@' + templateDependencies[key];
    }));
    fs.unlinkSync(templateDependenciesPath);
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (originalDirectory &&
    path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  // Change displayed command to yarn instead of yarnpkg
  const displayedCommand = useYarn ? 'yarn' : 'npm';

  console.log();
  console.log('Success! Created ' + appName + ' at ' + appPath);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan('  ' + displayedCommand + ' start'));
  console.log('    Starts the development server.');
  console.log();
  console.log(chalk.cyan('  ' + displayedCommand + ' run build'));
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan('  ' + displayedCommand + ' test'));
  console.log('    Starts the test runner.');
  console.log();
  console.log(chalk.cyan('  ' + displayedCommand + ' run eject'));
  console.log('    Removes this tool and copies build dependencies, configuration files');
  console.log('    and scripts into the app directory. If you do this, you can’t go back!');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log('  ' + chalk.cyan(displayedCommand + ' start'));
  console.log();
  console.log('Happy hacking!');
}
