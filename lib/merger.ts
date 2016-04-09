'use strict';
import { parse, format, Url } from 'url';
import * as tld from 'tldjs';
import { StatusEntry } from './';
import { normalizeWithRedirectInfo } from 'ps-url-normalizer';


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


class UrlEntry {
    url: string
    host: string
    entity: string
    fragments: Map<string, FragmentEntry> = new Map()

    constructor(url: string, host: string, entity: string) {
        this.url = url;
        this.host = host;
        this.entity = entity;
    }

    addStatusEntry(url: string, statusEntry: StatusEntry): void {
        const fragment = parse(url || '').hash || '';
        let fragmentEntry = this.fragments.get(fragment);

        if (!fragmentEntry) {
            fragmentEntry = new FragmentEntry(fragment);
            this.fragments.set(fragment, fragmentEntry);
        }

        fragmentEntry.addStatusEntry(statusEntry);
    }
}


function getUrlWithoutFragment(url: string): string {
    if (!url) {
        return '';
    }

    const urlObject = parse(url);
    urlObject.hash = '';
    return format(urlObject);
}

interface HostAndEntity {
    host: string
    entity: string
}

function getHostAndEntity(url: string): HostAndEntity {
    const hostAndEntity: HostAndEntity = { host: '', entity: '' };
    if (!url) {
        return hostAndEntity;
    }

    const urlObject = parse(url);
    const host = urlObject.host;

    if (host === 'github.com') {
        const pathname = urlObject.pathname;
        const username = /^\/([^/]+)\//.exec(pathname)[1];
        const entity = username.toLowerCase();

        hostAndEntity.host = host + '/' + entity;
        hostAndEntity.entity = entity;
        return hostAndEntity;
    }

    const domain = tld.getDomain(host);
    let entity = domain.split('.')[0];
    if (entity === 'w3') {
        entity = 'w3c';
    }

    hostAndEntity.host = host;
    hostAndEntity.entity = entity;

    return hostAndEntity;
}


export interface MergedStatusEntry {
    urls: Map<string, UrlEntry>
    entities: Map<string, Set<string>>
    redirects: Map<string, any>
}

export async function merge(statusEntriesList: StatusEntry[][]): Promise<MergedStatusEntry> {
    const urlMap: Map<string, UrlEntry> = new Map();
    const entityMap: Map<string, Set<string>> = new Map();
    const redirectMap: Map<string, any> = new Map();

    for (const statusEntries of statusEntriesList) {
        for (const statusEntry of statusEntries) {
            const url = statusEntry.url || '';
            const urlInfo = await normalizeWithRedirectInfo(url);

            if (url !== '' && urlInfo.redirects.length > 0) {
                redirectMap.set(url, urlInfo.redirects);
            }

            const normalizedUrl = urlInfo.url;

            const normalizedUrlWithoutFragment = getUrlWithoutFragment(normalizedUrl);
            let entry = urlMap.get(normalizedUrlWithoutFragment);
            if (!entry) {
                const hostAndEntity = getHostAndEntity(normalizedUrl);

                const entity = hostAndEntity.entity;
                if (!entityMap.has(entity)) {
                    entityMap.set(entity, new Set());
                }
                const host = hostAndEntity.host;
                entityMap.get(entity).add(host);

                entry = new UrlEntry(normalizedUrlWithoutFragment, host, entity);
                urlMap.set(normalizedUrlWithoutFragment, entry);
            }

            entry.addStatusEntry(normalizedUrl, statusEntry);
        }
    }

    return {
        urls: urlMap,
        entities: entityMap,
        redirects: redirectMap,
    };
}
