'use strict';
import { SpecEntry } from './';
import * as chromium from './chromium';
import * as edge from './edge';
import * as gecko from './gecko';
import * as webkit from './webkit';


export async function normalize(): Promise<SpecEntry[][]> {
    const data = await Promise.all([
        chromium.parse(),
        edge.parse(),
        gecko.parse(),
        webkit.parse(),
    ]);

    return data;
}
