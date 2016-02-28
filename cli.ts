'use strict';
import * as normalizer from './';

function run(argv: string[]): Promise<any>  {
    const command = argv[2] || '';
    if (command === 'update') {
        return normalizer.update();
    } else if (command === 'normalize') {
        return normalizer.normalize();
    }
    
    const err = new Error(`Unknown commad: ${argv.join(' ')}`);
    return Promise.reject(err);
}

run(process.argv).then(() => {
    process.exit();
}).catch((err) => {
    console.error(err);
    if (err.stack) {
        console.error(err.stack);
    }
    process.exit(1);
});
