'use strict';
import * as fs from 'fs';
import * as stringify from 'json-stable-stringify';
import { StatusEntry } from './lib';
import * as normalizer from './';


/*
 * Util
 */
function writeFile(filePath: string, text: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(filePath, text, (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        })
    });
}

/*
 * Status Entry Formatter
 */
async function normalize(): Promise<any> {
    const specEntries = await normalizer.normalize();

    const text = stringify(specEntries);

    await writeFile('normalized.json', text);
}


/*
 * Entity Entry Formatter
 */
async function merge(): Promise<any> {
    const specEntries = await normalizer.normalize();
    const merged = await normalizer.merge(specEntries);

    const text = stringify(merged, {
        replacer: (key: string, map: Map<any, any>): any => {
            if (map instanceof Map) {
                const obj = {};
                for (const pair of map) {
                    obj[pair[0]] = pair[1];
                }
                return obj;
            }

            return map;
        },
        space: '\t',
    });

    await writeFile('data.json', text);
}


/*
 * Run
 */
function run(argv: string[]): Promise<any> {
    const command = argv[2] || '';
    if (command === 'update') {
        return normalizer.update();
    } else if (command === 'normalize') {
        return normalize();
    } else if (command === 'merge') {
        return merge();
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
