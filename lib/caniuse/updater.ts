'use strict';
import * as path from 'path';
import { download } from '../utils';

export function update(): Promise<void> {
    const url = 'https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json';
    const outPath = path.join(__dirname, 'data.json');
    return download(url, outPath);
}
