'use strict';
import * as path from 'path';
import { download } from '../utils';

function downloadJSON(jsonPath: string, component: string): Promise<void> {
    const url = 'https://svn.webkit.org/repository/webkit/trunk/' + jsonPath;    
    const outPath = path.join(__dirname, component + '-features.json');
    return download(url, outPath);
}

export function update(): Promise<any> {
    return downloadJSON('Source/JavaScriptCore/features.json', 'jsc').then(() => {
        return downloadJSON('Source/WebCore/features.json', 'webcore');
    });
}
