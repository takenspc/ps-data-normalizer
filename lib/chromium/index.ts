'use strict';
import * as path from 'path';
import { readJSON } from '../utils';
import { StatusEntry, Status } from '../';

const statusMap = new Map<string, string>([
    ['Enabled by default', Status.STATUS_SUPPORTED],
    ['Behind a flag', Status.STATUS_SUPPORTED],
    ['In experimental framework', Status.STATUS_IN_DEVELOPMENT],
    ['In development', Status.STATUS_IN_DEVELOPMENT],
    ['Proposed', Status.STATUS_UNDER_CONSIDERATION],
    ['No active development', Status.STATUS_NOT_PLANNED],
    ['No longer pursuing', Status.STATUS_UNDER_CONSIDERATION],
    ['Deprecated', Status.STATUS_DEPRECATED],
    ['Removed', Status.STATUS_REMOVED],
]);

function normalizeStatus(entry): Status {
    const originalStatus = entry.impl_status_chrome;
    const status = statusMap.get(originalStatus);
    const channel = entry.shipped_milestone;

    const behindFlag = !!entry.meta.needFlag;
    const prefixed = !!entry.prefixed;
    return new Status(status, originalStatus, channel, behindFlag, prefixed);
}


export async function parse(): Promise<StatusEntry[]> {
    const statusEntries: StatusEntry[] = [];
    const engine = 'chromium';

    const jsonPath = path.join(__dirname, 'features.json');
    const data = await readJSON(jsonPath);

    for (const entry of data) {
        const id = entry.id;
        const title = entry.name;
        const status = normalizeStatus(entry);

        const urls = entry.spec_link ? entry.spec_link.split(',') : [''];
        for (const url of urls) {
            const statusEntry = new StatusEntry(engine, id, title, url.trim(), status);
            statusEntries.push(statusEntry);
        }
    }

    return statusEntries;
}
