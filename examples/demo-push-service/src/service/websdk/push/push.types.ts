type StringifiedVoximplantPushMessage = string;

export interface VoximplantPushData {
    [key: string]: string,
    voximplant: StringifiedVoximplantPushMessage
};

export interface VoximplantPushMessage {
    callid: string,
    sessionid: string,
    sipuri: string,
    video: boolean,
    addr: string,
    display_name: string,
    userid: string,
    analytics_label: string
};