'use strict';
import { StatusEntry } from './';
import { normalize } from 'ps-url-normalizer';


export class SpecEntry {
    url: string
    engines: Map<string, StatusEntry[]>

    constructor(url: string, statusEntry: StatusEntry) {
        this.url = url;
        this.engines = new Map<string, StatusEntry[]>();
        this.addStatusEntry(statusEntry);
    }
    
    addStatusEntry(statusEntry: StatusEntry) {
        const engine = statusEntry.engine;
        const statusEntries = this.engines.get(engine);
        if (!statusEntries) {
            this.engines.set(engine, [statusEntry]);
        } else {
            statusEntries.push(statusEntry);
        }
    }

    static compare(a: SpecEntry, b: SpecEntry): number {
        if (a.url < b.url) {
            return -1;
        }

        if (a.url > b.url) {
            return 1;
        }

        return 0;
    }
}

export function merge(statusEntriesList: StatusEntry[][]): SpecEntry[] {
    const specEntries: SpecEntry[] = [];
    const urlToSpecEntry: Map<string, SpecEntry> = new Map();

    for (const statusEntries of statusEntriesList) {
        for (const statusEntry of statusEntries) {
            const url = statusEntry.url;
            if (!url || url === '') {
                const specEntry = new SpecEntry(url, statusEntry);
                specEntries.push(specEntry);
                continue;
            }

            const normalizedURL = normalize(url);

            if (!urlToSpecEntry.has(normalizedURL)) {
                const specEntry = new SpecEntry(normalizedURL, statusEntry);
                urlToSpecEntry.set(normalizedURL, specEntry);
                continue;
            }

            const specEntry = urlToSpecEntry.get(normalizedURL);
            specEntry.addStatusEntry(statusEntry);
        }
    }

    for (const entry of urlToSpecEntry.values()) {
        specEntries.push(entry);
    }

    return specEntries.sort(SpecEntry.compare);
}
