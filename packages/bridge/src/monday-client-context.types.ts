export interface MondayClientContext {
    method:    string;
    type:      string;
    data:      {
        boardIds:     number[];
        itemIds:     number[];
        viewMode:     string;
        editMode:     boolean;
        instanceId:   number;
        instanceType: string;
        theme:        string;
        account:      Account;
        user:         User;
        region:       string;
        app:          App;
        appVersion:   AppVersion;
        appFeature:   AppFeature;
    };
    requestId: string;
}

export interface Account {
    id: string;
}

export interface App {
    id:       number;
    clientId: string;
}

export interface AppFeature {
    type: string;
    name: string;
}

export interface AppVersion {
    id:          number;
    name:        string;
    status:      string;
    type:        string;
    versionData: VersionData;
}

export interface VersionData {
    major: number;
    minor: number;
    patch: number;
    type:  string;
}

export interface User {
    id:              string;
    isAdmin:         boolean;
    isGuest:         boolean;
    isViewOnly:      boolean;
    countryCode:     string;
    currentLanguage: string;
    timeFormat:      string;
    timeZoneOffset:  number;
}

export interface MondayClientSessionToken {
    method:    string;
    type:      string;
    data:      string;
    requestId: string;
}


export interface MondayClientSettings {
    method:    string;
    type:      string;
    data:      unknown; // TODO: add when known
    requestId: string;
}

