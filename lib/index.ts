'use strict';

export class Status {
    status: string
    originalStatus: string
    channel: number
    behindFlag: boolean
    prefixed: boolean

    static STATUS_SUPPORTED: string = 'supported'
    static STATUS_IN_DEVELOPMENT: string = 'in-development'
    static STATUS_UNDER_CONSIDERATION: string = 'under-consideration'
    static STATUS_NOT_PLANNED: string = 'not-planned'
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
    url: string
    redirects: any[]
    statusURL: string
    status: Status

    constructor(engine: string, id: string, title: string, url: string, status: Status) {
        this.engine = engine;
        this.id = id;
        this.title = title;
        this.url = url;
        this.statusURL = StatusEntry.resolveStatusURL(engine, id);
        this.status = status;
    }

    static resolveStatusURL(engine: string, id: string): string {
        if (engine === 'chromium') {
            return 'https://www.chromestatus.com/features/' + encodeURI(id);
        }
        
        if (engine === 'edge') {
            return 'https://dev.windows.com/en-us/microsoft-edge/platform/status/' + encodeURI(id);
        }
        
        if (engine === 'gecko') {
            return 'https://platform-status.mozilla.org/#' + encodeURI(id);
        }

        if (engine === 'webkit') {
            return 'https://webkit.org/status/#feature-' + encodeURI(id);
        }

        throw new Error('Unknown engine: ' + engine);
    }
}
