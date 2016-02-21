'use strict';
import * as path from 'path';
import { readJSON } from '../utils';
import { StatusEntry, SpecEntry, Status } from '../';

const STABLE_VERSION: number = 48;

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
    let text = statusMap.get(entry.impl_status_chrome);
    let channel = Status.CHANNEL_STABLE;

    const version = entry.shipped_milestone;
    if (version < STABLE_VERSION) {
        channel = Status.CHANNEL_PREVIEW;
    }

    const behindFlag = entry.meta.needFlag;
    const prefixed = !!entry.prefixed;
    return new Status(text, channel, behindFlag, prefixed);
}


export async function parse(): Promise<SpecEntry[]> {
const specEntries: SpecEntry[] = [];
    const engine = 'chromium';

    const jsonPath = path.join(__dirname, 'features.json');
    const data = await readJSON(jsonPath);

    for (const entry of data) {
        const id = entry.id;
        const title = entry.name;
        const status = normalizeStatus(entry);
        const statusEntry = new StatusEntry(engine, id, title, status);

        const url = entry.spec_link;
        const specEntry = new SpecEntry(url);
        specEntry.statusMap.set(engine, statusEntry);

        specEntries.push(specEntry);
    }

    return specEntries;
}
