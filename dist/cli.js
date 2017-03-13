const script = process.argv[2];
const args = process.argv.slice(3);
switch (script) {
    default: {
        console.log('Unknown script "' + script + '".');
        console.log('Perhaps you need to update react-typescripts?');
        console.log('See: https://github.com/ewgenius/react-typescripts');
        break;
    }
}
