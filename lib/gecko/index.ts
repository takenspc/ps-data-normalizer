'use strict';
import * as path from 'path';
import { readdir, readYAML } from '../utils';
import { StatusEntry, SpecEntry, Status } from '../';


const statusMap = new Map<string, string>([
    ["in-development", Status.STATUS_IN_DEVELOPMENT],
    ["under-consideration", Status.STATUS_UNDER_CONSIDERATION],
    ["not-planned", Status.STATUS_NOT_PLANNED]
]);

function normalizeStatus(firefoxStatus: string): Status {
    let text;
    let channel;

    const version = parseInt(firefoxStatus, 10);
    if (isNaN(version)) {
        text = statusMap.get(firefoxStatus);
        channel = null;
    } else {
        text = Status.STATUS_SUPPORTED;
        channel = version;
    }

    // there are no corresponding entries
    const behindFlag = false;
    const prefixed = false;

    return new Status(text, channel, behindFlag, prefixed);
}


export async function parse(): Promise<SpecEntry[]> {
    const specEntries: SpecEntry[] = [];
    const engine = 'gecko';

    const dirPath = path.join(__dirname, 'platatus', 'features');
    const files = await readdir(dirPath);
    for (const file of files) {
        if (!file.endsWith('.md')) {
            continue
        }
        const mdPath = path.join(dirPath, file);
        const entry = await readYAML(mdPath);

        const id = entry.title;
        const title = entry.title;
        const status = normalizeStatus(entry.firefox_status);
        const statusEntry = new StatusEntry(engine, id, title, status);

        const url = entry.spec_url;
        const specEntry = new SpecEntry(url);
        specEntry.statusMap.set(engine, statusEntry);

        specEntries.push(specEntry);
    }

    return specEntries;
}
