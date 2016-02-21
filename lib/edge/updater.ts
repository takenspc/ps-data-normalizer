'use strict';
import * as path from 'path';
import { download } from '../utils';

export function update(): Promise<void> {
    const url = 'https://dev.windows.com/en-us/microsoft-edge/api/platform/status/';
    const outPath = path.join(__dirname, 'status.json');
    return download(url, outPath);
}
