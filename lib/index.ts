'use strict';

export class Status {
    status: string
    originalStatus: string
    channel: number
    behindFlag: boolean
    prefixed: boolean

    static STATUS_SUPPORTED: string = 'supported'
    static STATUS_IN_DEVELOPMENT: string = 'in development'
    static STATUS_UNDER_CONSIDERATION: string = 'under consideration'
    static STATUS_NOT_PLANNED: string = 'not planned'
    static STATUS_DEPRECATED: string = 'deprecated'
    static STATUS_REMOVED: string = 'removed'


    constructor(status: string, originalStatus: string, channel: number, behindFlag: boolean, prefixed: boolean) {
        this.status = status;
        this.originalStatus = originalStatus;
        this.channel = channel;
        this.behindFlag = behindFlag;
        this.prefixed = prefixed;
    }
}

export class StatusEntry {
    engine: string
    id: string
    title: string
    status: Status

    constructor(engine: string, id: string, title: string, status: Status) {
        this.engine = engine;
        this.id = id;
        this.title = title;
        this.status = status;
    }
}

export class SpecEntry {
    url: string
    statusMap: Map<string, StatusEntry> = new Map<string, StatusEntry>();

    constructor(url: string) {
        this.url = url;
    }
}
