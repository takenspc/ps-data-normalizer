'use strict';
import * as path from 'path';
import { readJSON } from '../utils';
import { StatusEntry, Status } from '../';


interface WebKitStatus {
    status: string,
    'enabled-by-default': boolean
}

const statusMap = new Map<string, string>([
    ['Done', Status.STATUS_SUPPORTED],
    ['Partial Support', Status.STATUS_SUPPORTED],
    ['In Development', Status.STATUS_IN_DEVELOPMENT],
    ['Prototyping', Status.STATUS_IN_DEVELOPMENT],
    ['Under Consideration', Status.STATUS_UNDER_CONSIDERATION],
    ['Not Considering', Status.STATUS_NOT_PLANNED],
    ['Removed', Status.STATUS_REMOVED],
]);

function normalizeStatus(webkitStatus: WebKitStatus): Status {
    const originalStatus = webkitStatus.status;
    const status = statusMap.get(originalStatus);
    const behindFlag = !!webkitStatus['enabled-by-default'];

    // there are no corresponding entries
    const channel = null;
    const prefixed = false;

    return new Status(status, originalStatus, channel, behindFlag, prefixed);
}

async function parseComponent(component: string): Promise<StatusEntry[]> {
    const statusEntries: StatusEntry[] = [];
    const engine = 'webkit';

    const jsonPath = path.join(__dirname, component + '-features.json');
    const data = await readJSON(jsonPath);

    for (const entry of data.specification) {
        const id = entry.name;
        const title = entry.name;
        const url = entry.url;

        // CSS Media Queries Level 4 and so on
        if (!entry.status) {
            continue;
        }
        
        const status = normalizeStatus(entry.status);

        const statusEntry = new StatusEntry(engine, id, title, url, status);

        statusEntries.push(statusEntry);
    }

    return statusEntries;
}

export async function parse(): Promise<StatusEntry[]> {
    const specEntriesList = await Promise.all([
        parseComponent('jsc'),
        parseComponent('webcore'),
    ]);
    
    return specEntriesList[0].concat(specEntriesList[1])
}
