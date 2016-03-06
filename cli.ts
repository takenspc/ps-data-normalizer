'use strict';
import * as fs from 'fs';
import { StatusEntry } from './lib';
import { SpecEntry } from './lib/merger';
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

function repalceMapWithObject(key: string, map: Map<any, any>): any {
    if (map instanceof Map) {
        const obj = {};
        for (const pair of map) {
            obj[pair[0]] = pair[1];
        }
        return obj;
    }

    return map;
}

/*
 * Status Entry Formatter
 */
function formatHeader(): string[] {
    const values: string[] = [];

    values.push('url' /* statusEntry.url */);
    values.push('title' /* statusEntry.title */);
    values.push('status' /* statusEntry.status.status */);
    values.push('original status' /* statusEntry.status.originalStatus */);

    return values;
}

function formatStatusEntry(statusEntry: StatusEntry): string[] {
    const values: string[] = [];

    values.push(statusEntry ? statusEntry.url : '');
    values.push(statusEntry ? statusEntry.title : '');
    values.push(statusEntry ? statusEntry.status.status : '');
    values.push(statusEntry ? statusEntry.status.originalStatus : '');

    return values;
}


async function normalize(): Promise<any> {
    const specEntries = await normalizer.normalize();

    await writeFile('data.json', JSON.stringify(specEntries, repalceMapWithObject, '\t'));

    const lines: string[] = [];
    const engines = ['chromium', 'edge', 'gecko', 'webkit'];

    {
        let values = ['#url'];
        for (const engine of engines) {
            values = values.concat(formatHeader().map((header) => {
                return '#' + engine + ' ' + header; 
            }));
        }
        lines.push(values.join('\t'));
    }


    for (const specEntry of specEntries) {
        const url = specEntry.url;
        for (let i = 0, len = specEntry.maxEntryLength; i < len; i++) {
            let values = [url];
            for (const engine of engines) {
                const statusEntries = specEntry.engines.get(engine);
                const statusEntry = (statusEntries && i < statusEntries.length) ? statusEntries[i] : null;
                values = values.concat(formatStatusEntry(statusEntry));
            }
            lines.push(values.join('\t'));
        }
    }

    await writeFile('data.tsv', lines.join('\n'));
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
