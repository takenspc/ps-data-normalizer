'use strict';
import * as merger from './lib/merger';
import * as normalizer from './lib/normalizer';
import * as updater from './lib/updater';


export async function update(): Promise<void> {
    await updater.update();
}

export async function normalize(): Promise<merger.SpecEntry[]> {
    const data = await normalizer.normalize();
    return merger.merge(data);
}
