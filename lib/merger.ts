'use strict';
import { parse, format, Url } from 'url';
import * as tld from 'tldjs';
import { StatusEntry } from './';
import { normalize } from 'ps-url-normalizer';


class FragmentEntry {
    fragment: string
    engines: Map<string, StatusEntry[]> = new Map()

    constructor(fragment: string) {
        this.fragment = fragment;
    }

    addStatusEntry(statusEntry: StatusEntry) {
        const engine = statusEntry.engine;
        let statusEntries = this.engines.get(engine);

        if (!statusEntries) {
            statusEntries = [];
            this.engines.set(engine, statusEntries);
        }

        statusEntries.push(statusEntry);
    }
}


class URLEntry {
    url: string
    fragments: Map<string, FragmentEntry> = new Map()

    constructor(url: string) {
        this.url = url;
    }

    addStatusEntry(statusEntry: StatusEntry): void {
        const fragment = parse(statusEntry.url || '').hash || '';
        let fragmentEntry = this.fragments.get(fragment);

        if (!fragmentEntry) {
            fragmentEntry = new FragmentEntry(fragment);
            this.fragments.set(fragment, fragmentEntry);
        }

        fragmentEntry.addStatusEntry(statusEntry);
    }
}


class HostEntry {
    host: string
    urls: Map<string, URLEntry> = new Map()

    constructor(host: string) {
        this.host = host;
    }

    addStatusEntry(statusEntry: StatusEntry): void {
        const url = HostEntry.getURLWithoutFragment(statusEntry.url);
        let urlEntry = this.urls.get(url);

        if (!urlEntry) {
            urlEntry = new URLEntry(url);
            this.urls.set(url, urlEntry);
        }

        urlEntry.addStatusEntry(statusEntry);
    }

    static getURLWithoutFragment(url: string): string {
        if (!url) {
            return '';
        }

        const urlObject = parse(url);
        urlObject.hash = '';
        return format(urlObject);
    }
}


export class EntityEntry {
    entity: string
    hosts: Map<string, HostEntry> = new Map()

    constructor(entity: string) {
        this.entity = entity;
    }

    addStatusEntry(statusEntry: StatusEntry): void {
        const host = EntityEntry.getHost(statusEntry.url);


        let hostEntry = this.hosts.get(host);

        if (!hostEntry) {
            hostEntry = new HostEntry(host);
            this.hosts.set(host, hostEntry);
        }

        hostEntry.addStatusEntry(statusEntry);
    }

    static getHost(url: string): string {
        if (!url) {
            return '';
        }

        const urlObject = parse(url);
        const host = urlObject.host;
        const pathname = urlObject.pathname;
        if (host === 'github.com') {
            const username = /^\/([^/]+)\//.exec(pathname)[1];
            const entity = username.toLowerCase();
            return host + '/' + entity;
        }

        return host;
    }
}


function getEntity(url: string): string {
    if (!url) {
        return '';
    }

    const urlObject = parse(url);
    const host = urlObject.host;
    const pathname = urlObject.pathname;
    if (host === 'github.com') {
        const username = /^\/([^/]+)\//.exec(pathname)[1];
        const entity = username.toLowerCase();
        return entity;
    }

    const domain = tld.getDomain(host);
    let entity = domain.split('.')[0];
    if (entity === 'w3') {
        entity = 'w3c';
    }

    return entity;
}


export async function merge(statusEntriesList: StatusEntry[][]): Promise<Map<string, EntityEntry>> {
    const entityMap: Map<string, EntityEntry> = new Map();

    for (const statusEntries of statusEntriesList) {
        for (const statusEntry of statusEntries) {
            const normalizedURL = await normalize(statusEntry.url || '');

            const entity = getEntity(normalizedURL);

            let entry = entityMap.get(entity);
            if (!entry) {
                entry = new EntityEntry(entity);
                entityMap.set(entity, entry);
            }

            entry.addStatusEntry(statusEntry);
        }
    }

    return entityMap;
}
