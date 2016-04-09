'use strict';
import * as fs from 'fs';
import * as stringify from 'json-stable-stringify';
import { MergedStatusEntry } from './lib/merger';
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
async function normalize(): Promise<StatusEntry[][]> {
    const specEntries = await normalizer.normalize();

    const text = stringify(specEntries);

    await writeFile('raw.json', text);

    return specEntries;
}


/*
 * Entity Entry Formatter
 */
async function merge(specEntries: StatusEntry[][]): Promise<MergedStatusEntry> {
    const merged = await normalizer.merge(specEntries);

    const text = stringify(merged, {
        replacer: (key: string, mapOrSet: Map<any, any> | Set<any>): any => {
            if (mapOrSet instanceof Map) {
                const obj = {};
                for (const pair of mapOrSet) {
                    obj[pair[0]] = pair[1];
                }
                return obj;
            }
            
            if (mapOrSet instanceof Set) {
                const array = [];
                for (const value of mapOrSet) {
                    array.push(value);
                }
                return array.sort();
            }

            return mapOrSet;
        },
        space: '\t',
    });

    await writeFile('data.json', text);
    
    return merged;
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
        return normalize().then((specEntries) => {
            return merge(specEntries);
        });
    }

    const err = new Error(`Unknown commad: ${argv.join(' ')}`);
    return Promise.reject(err);
}

run(process.argv).then(() => {
    process.exit();
}).catch((err) => {
    console.log('error');
    console.error(err);
    if (err.stack) {
        console.error(err.stack);
    }
    process.exit(1);
});
