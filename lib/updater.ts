'use strict';
import * as chromium from './chromium/updater';
import * as edge from './edge/updater';
import * as gecko from './gecko/updater';
import * as webkit from './webkit/updater';
import * as normalizer from 'ps-url-normalizer';


export function update(): Promise<any> {
    return Promise.all([
        normalizer.update(),
        chromium.update(),
        edge.update(),
        gecko.update(),
        webkit.update(),
    ]);
}
