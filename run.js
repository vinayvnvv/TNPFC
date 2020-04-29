const execSync = require('child_process').execSync;

const arg = process.argv[2] || 'dv'; // Default value `dv` if no args provided via CLI.

console.log(process.argv);


function getArgs () {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
        // long arg
        if (arg.slice(0,2) === '--') {
            const longArg = arg.split('=');
            const longArgFlag = longArg[0].slice(2,longArg[0].length);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
        // flags
        else if (arg[0] === '-') {
            const flags = arg.slice(1,arg.length).split('');
            flags.forEach(flag => {
            args[flag] = true;
            });
        }
    });
    return args;
}
const args = getArgs();
console.log(args);

// execSync('npm run vumper ' + arg, {stdio:[0, 1, 2]});
// execSync('npm run format', {stdio:[0, 1, 2]});