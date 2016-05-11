'use strict';
import * as path from 'path';
import { readJSON } from '../utils';
import { StatusEntry, Status } from '../';

function isAllStableBrowsersSupport(feature: any): boolean {
    return false;
}

function isNoBrowsersSuppport(feature: any): boolean {
    return false;
}


function normalizeStatus(feature: any): Status {
    let status = Status.STATUS_IN_DEVELOPMENT;
    
    if (isAllStableBrowsersSupport(feature)) {
        status = Status.STATUS_SUPPORTED;
    } else if (isNoBrowsersSuppport(feature)) {
        status = Status.STATUS_UNDER_CONSIDERATION;
    }
    
    
    const originalStatus = status;

    const channel = null;
    const prefixed = false;
    const behindFlag = false;

    return new Status(status, originalStatus, channel, behindFlag, prefixed);
}


export async function parse(): Promise<StatusEntry[]> {
    const statusEntries: StatusEntry[] = [];
    const engine = 'caniuse';

    const jsonPath = path.join(__dirname, 'data.json');
    const data = await readJSON(jsonPath);

    for (const key of Object.keys(data.data)) {
        const id = key;
        const value = data.data[key];
        const title = value.title;
        const url = value.spec;
        const status = normalizeStatus(value.stats);

        const statusEntry = new StatusEntry(engine, id, title, url, status);
        statusEntries.push(statusEntry);
    }

    return statusEntries;
}
