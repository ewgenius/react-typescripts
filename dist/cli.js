"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const script = process.argv[2];
// const args = process.argv.slice(3);
const build_1 = require("./build");
const start_1 = require("./start");
switch (script) {
    case 'start': {
        start_1.start();
        break;
    }
    case 'build': {
        build_1.build();
        break;
    }
    default: {
        console.log('Unknown script "' + script + '".');
        console.log('Perhaps you need to update react-typescripts?');
        console.log('See: https://github.com/ewgenius/react-typescripts');
        break;
    }
}
