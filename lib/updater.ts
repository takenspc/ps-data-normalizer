'use strict';
import * as chromium from './chromium/updater';
import * as edge from './edge/updater';
import * as gecko from './gecko/updater';
import * as webkit from './webkit/updater';


export async function update(): Promise<void> {
    await Promise.all([
        chromium.update(),
        edge.update(),
        gecko.update(),
        webkit.update(),
    ]);
}
