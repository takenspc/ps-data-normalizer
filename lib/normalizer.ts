'use strict';
import { StatusEntry } from './';
import * as caniuse from './caniuse';
import * as chromium from './chromium';
import * as edge from './edge';
import * as gecko from './gecko';
import * as webkit from './webkit';


export async function normalize(): Promise<StatusEntry[][]> {
    const data = await Promise.all([
        caniuse.parse(),
        chromium.parse(),
        edge.parse(),
        gecko.parse(),
        webkit.parse(),
    ]);

    return data;
}
