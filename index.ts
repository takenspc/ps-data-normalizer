'use strict';
import { StatusEntry } from './lib';
import * as merger from './lib/merger';
import * as normalizer from './lib/normalizer';
import * as updater from './lib/updater';


export function update(): Promise<any> {
    return updater.update();
}

export function normalize(): Promise<StatusEntry[][]> {
    return normalizer.normalize();
}

export function merge(data: StatusEntry[][]): Promise<Map<string, merger.EntityEntry>> {
    return merger.merge(data);
}

