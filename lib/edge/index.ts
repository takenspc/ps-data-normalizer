'use strict';
import * as path from 'path';
import { readJSON } from '../utils';
import { StatusEntry, Status } from '../';


interface IEStatus {
    status: string
    link: string
    prefixed: number
    unprefixed: number
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

function normalizeStatus(position: string, ieStatus: IEStatus): Status {
    const originalStatus = position;
    const status = statusMap.get(position);

    const channel = ieStatus.unprefixed || ieStatus.prefixed || null;

    const prefixed = originalStatus === 'Prefixed';
    const behindFlag = !!ieStatus.flag;

    return new Status(status, originalStatus, channel, behindFlag, prefixed);
}


export async function parse(): Promise<StatusEntry[]> {
    const statusEntries: StatusEntry[] = [];
    const engine = 'edge';

    const jsonPath = path.join(__dirname, 'status.json');
    const data = await readJSON(jsonPath);

    for (const entry of data.data) {
        const id = entry.normalized_name;
        const title = entry.name;
        const url = entry.spec.link;
        const status = normalizeStatus(entry.position, entry.browsers.ie);

        const statusEntry = new StatusEntry(engine, id, title, url, status);
        statusEntries.push(statusEntry);
    }

    return statusEntries;
}
