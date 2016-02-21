'use strict';
import * as path from 'path';
import { download } from '../utils';

export function update(): Promise<void> {
    const url = 'https://www.chromestatus.com/features.json';
    const outPath = path.join(__dirname, 'features.json');
    return download(url, outPath);
}
