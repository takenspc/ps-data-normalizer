'use strict';
import { SpecEntry } from './';


export function merge(specEntriesList: SpecEntry[][]): SpecEntry[] {
    const entries: SpecEntry[] = [];
    const urlToSpecEntry = new Map<string, SpecEntry>();

    for (const specEntries of specEntriesList) {
        for (const specEntry of specEntries) {
            const url = specEntry.url;
            if (!url || url === '') {
                entries.push(specEntry);
                continue;
            }
            
            if (!urlToSpecEntry.has(url)) {
                urlToSpecEntry.set(url, specEntry);
                continue;
            }

            const entry = urlToSpecEntry.get(url);
            for (const pair of specEntry.statusMap) {
                const engine = pair[0];
                const statusEntry = pair[1];
                entry.statusMap.set(engine, statusEntry);
            }
        }
    }

    for (const entry of urlToSpecEntry.values()) {
        entries.push(entry);
    }

    return entries;
}
