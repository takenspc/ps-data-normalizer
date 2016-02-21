'use strict';
import * as path from 'path';
import { readJSON } from '../utils';
import { StatusEntry, SpecEntry, Status } from '../';


interface IEStatus {
    status: string
    link: string
    prefixed: string
    unprefixed: string
    priority?: string
    flag?: boolean
}

const statusMap = new Map<string, string>([
    ['Shipped', Status.STATUS_SUPPORTED],
    ['Preview Release', Status.STATUS_SUPPORTED],
    ['Prefixed', Status.STATUS_SUPPORTED],
    ['In Development', Status.STATUS_IN_DEVELOPMENT],
    ['Under Consideration', Status.STATUS_UNDER_CONSIDERATION],
    ['Not currently planned', Status.STATUS_NOT_PLANNED],
    ['Deprecated', Status.STATUS_DEPRECATED],
]);

function normalizeStatus(ieStatus: IEStatus): Status {
    const text = statusMap.get(ieStatus.status);

    const channel = ieStatus.status === 'Preview Release' ? Status.CHANNEL_PREVIEW : Status.CHANNEL_STABLE;

    const prefixed = ieStatus.status === 'Prefixed';
    const behindFlag = !!ieStatus.flag;

    return new Status(text, channel, behindFlag, prefixed);
}


export async function parse(): Promise<SpecEntry[]> {
    const specEntries: SpecEntry[] = [];
    const engine = 'edge';

    const jsonPath = path.join(__dirname, 'status.json');
    const data = await readJSON(jsonPath);

    for (const entry of data.data) {
        const id = entry.normalized_name;
        const title = entry.name;
        const status = normalizeStatus(entry.browsers.ie);
        const statusEntry = new StatusEntry(engine, id, title, status);

        const url = entry.link;
        const specEntry = new SpecEntry(url);
        specEntry.statusMap.set(engine, statusEntry);

        specEntries.push(specEntry);
    }

    return specEntries;
}
