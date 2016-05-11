'use strict';
import * as normalizer from 'ps-url-normalizer';
import * as caniuse from './caniuse/updater';
import * as chromium from './chromium/updater';
import * as edge from './edge/updater';
import * as gecko from './gecko/updater';
import * as webkit from './webkit/updater';


export function update(): Promise<any> {
    return Promise.all([
        normalizer.update(),
        caniuse.update(),
        chromium.update(),
        edge.update(),
        gecko.update(),
        webkit.update(),
    ]);
}
