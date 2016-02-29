'use strict';
import * as path from 'path';
import { readdir, readYAML } from '../utils';
import { StatusEntry, Status } from '../';


const statusMap = new Map<string, string>([
    ["in-development", Status.STATUS_IN_DEVELOPMENT],
    ["under-consideration", Status.STATUS_UNDER_CONSIDERATION],
    ["not-planned", Status.STATUS_NOT_PLANNED]
]);

function normalizeStatus(firefoxStatus: string): Status {
    const originalStatus = firefoxStatus;

    let status: string;
    let channel: number;
    const version = parseInt(originalStatus, 10);
    if (isNaN(version)) {
        status = statusMap.get(originalStatus);
        channel = null;
    } else {
        status = Status.STATUS_SUPPORTED;
        channel = version;
    }

    // there are no corresponding entries
    const behindFlag = false;
    const prefixed = false;

    return new Status(status, originalStatus, channel, behindFlag, prefixed);
}


export async function parse(): Promise<StatusEntry[]> {
    const statusEntries: StatusEntry[] = [];
    const engine = 'gecko';

    const dirPath = path.join(__dirname, 'platatus', 'features');
    const files = await readdir(dirPath);
    for (const file of files) {
        if (!file.endsWith('.md')) {
            continue
        }
        const mdPath = path.join(dirPath, file);
        const entry = await readYAML(mdPath);

        const id = file.replace(/\.md$/, '');
        const title = entry.title;
        const url = entry.spec_url;
        const status = normalizeStatus(entry.firefox_status);

        const statusEntry = new StatusEntry(engine, id, title, url, status);

        statusEntries.push(statusEntry);
    }

    return statusEntries;
}
