'use strict';
import * as path from 'path';
import { download } from '../utils';

function downloadJSON(component: string, jsonPath: string): Promise<void> {
    const url = 'https://svn.webkit.org' + jsonPath;    
    const outPath = path.join(__dirname, component + '-features.json');
    return download(url, outPath);
}

export function update(): Promise<any> {
    return Promise.all([
        downloadJSON('jsc', '/repository/webkit/trunk/Source/JavaScriptCore/features.json'),
        downloadJSON('webcore', '/repository/webkit/trunk/Source/WebCore/features.json'),
    ]);
}
