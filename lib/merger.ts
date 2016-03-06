'use strict';
import { parse, format } from 'url';
import { StatusEntry } from './';
import { normalize } from 'ps-url-normalizer';


export class FragmentSpecEntry {
    fragment: string
    engines: Map<string, StatusEntry[]> = new Map()
    maxEntryLength: number = 0

    constructor(fragment: string, statusEntry: StatusEntry) {
        this.fragment = fragment;
        this.addStatusEntry(statusEntry);
    }

    addStatusEntry(statusEntry: StatusEntry) {
        const engine = statusEntry.engine;
        if (!this.engines.has(engine)) {
            const statusEntries = [statusEntry];
            this.engines.set(engine, statusEntries);
        } else {
            const statusEntries = this.engines.get(engine);
            statusEntries.push(statusEntry);
        }

        const entryLength = this.engines.get(engine).length;
        if (this.maxEntryLength < entryLength) {
          this.maxEntryLength = entryLength;
        }
    }

    static compare(a: FragmentSpecEntry, b: FragmentSpecEntry): number {
        if (a.fragment < b.fragment) {
            return -1;
        }

        if (a.fragment > b.fragment) {
            return 1;
        }

        return 0;
    }
}


export class SpecEntry {
    url: string
    fragments: FragmentSpecEntry[] = []

    constructor(url: string, statusEntry: StatusEntry) {
        this.url = url;
        this.addStatusEntry(statusEntry);
    }

    addStatusEntry(statusEntry: StatusEntry) {
        const fragment = parse(statusEntry.url || '').hash || '';

        // Use array because map cannot be sorted
        let fragmentSpecEntry: FragmentSpecEntry = null;
        for (const entry of this.fragments) {
            if (entry.fragment === fragment) {
                fragmentSpecEntry = entry;
                break;
            }
        }
        
        if (!fragmentSpecEntry) {
            const fragmentSpecEntry = new FragmentSpecEntry(fragment, statusEntry);
            this.fragments.push(fragmentSpecEntry);
        } else {
            fragmentSpecEntry.addStatusEntry(statusEntry);
        }
    }

    static getURLWithoutFragment(url: string): string {
        const urlObject = parse(url);
        urlObject.hash = '';
        return format(urlObject);
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
            const normalizedURL = normalize(statusEntry.url || '');

            const url = SpecEntry.getURLWithoutFragment(normalizedURL);

            if (!urlToSpecEntry.has(url)) {
                const specEntry = new SpecEntry(url, statusEntry);
                urlToSpecEntry.set(url, specEntry);
                continue;
            }

            const specEntry = urlToSpecEntry.get(url);
            specEntry.addStatusEntry(statusEntry);
        }
    }

    for (const entry of urlToSpecEntry.values()) {
        entry.fragments = entry.fragments.sort(FragmentSpecEntry.compare);
        specEntries.push(entry);
    }

    return specEntries.sort(SpecEntry.compare);
}
