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
}


export function merge(statusEntriesList: StatusEntry[][]): SpecEntry[] {
    const specEnntries: SpecEntry[] = [];
    const urlToSpecEntry: Map<string, SpecEntry> = new Map();

    for (const statusEntries of statusEntriesList) {
        for (const statusEntry of statusEntries) {
            const url = statusEntry.url;
            if (!url || url === '') {
                const specEntry = new SpecEntry(url, statusEntry);
                specEnntries.push(specEntry);
                continue;
            }

            const normalizedURL = normalize(url);

            if (!urlToSpecEntry.has(normalizedURL)) {
                const specEntry = new SpecEntry(url, statusEntry);
                urlToSpecEntry.set(normalizedURL, specEntry);
                continue;
            }

            const specEntry = urlToSpecEntry.get(normalizedURL);
            specEntry.addStatusEntry(statusEntry);
        }
    }

    for (const entry of urlToSpecEntry.values()) {
        specEnntries.push(entry);
    }

    return specEnntries;
}
