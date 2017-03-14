const script = process.argv[2];
// const args = process.argv.slice(3);

import { build } from './build';
import { start } from './start';

switch (script) {
  case 'start': {
    start();
    break;
  }
  case 'build': {
    build();
    break;
  }
  default: {
    console.log('Unknown script "' + script + '".');
    console.log('Perhaps you need to update react-typescripts?');
    console.log('See: https://github.com/ewgenius/react-typescripts');
    break;
  }
}
