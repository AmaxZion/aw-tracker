/**
 * @requestUrl  接口地址
 * @historyTracker  history上报
 * @hashTracker     hash上报
 * @domTracker      携带Tracker-key 点击事件上报
 * @sdkVersion     skd版本
 * @extra  透传字段
 * @jsError   js和promise 报错异常上报
*/

export interface DefaultOptions {
    uuid: string | undefined,
    requestUrl: string | undefined,
    historyTracker: boolean,
    hashTracker: boolean,
    domTracker: boolean,
    sdkVersion: string | number,
    extra: Record<string, any> | undefined,
    jsError: boolean
}

// 必传参数  继承的父类里面有非必传的参数 加这个Partial将参数变为?.
export interface OneOptions extends Partial<DefaultOptions> {
    requestUrl: string
}

// 版本
export enum TrackerConfig {
    version = '1.1.0'
}

// 上传必传参数
export type reportTrackerData = {
    [key: string] : any,
    event: string,
    targetKey: string
}