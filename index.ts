'use strict';
import { SpecEntry } from './lib/';
import * as merger from './lib/merger';
import * as normalizer from './lib/normalizer';
import * as updater from './lib/updater';


export async function update(): Promise<void> {
    await updater.update();
}

export async function normalize(): Promise<SpecEntry[]> {
    const data = await normalizer.normalize();
    return merger.merge(data);
}
