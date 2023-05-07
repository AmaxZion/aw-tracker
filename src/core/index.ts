import { DefaultOptions, TrackerConfig, OneOptions } from '../types/index';
import { createHistoryEvent } from '../utils/pv';


const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']
export default class Tracker {
    public data: OneOptions;
    public version: string | undefined;
    constructor (options: OneOptions) {
        this.data = Object.assign(this.initDef(), options);
        this.installTracker();
    }

    private initDef (): DefaultOptions {
        this.version = TrackerConfig.version;
        window.history['pushState'] = createHistoryEvent('pushState');
        window.history['replaceState'] = createHistoryEvent('replaceState');

        return <DefaultOptions> {
            sdkVersion: this.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false,
        }
    }

    public setUserId <T extends DefaultOptions['uuid']>(uuid: T) {
        this.data.uuid = uuid;
    }

    public setExtra <T extends DefaultOptions['extra']>(extra: T) {
        this.data.extra = extra;
    }

    // 用户手动上报
    public sendTracker <T>(data: T) {
        this.reportTracker(data);
    }
    // dom点击上报
    private targetKeyReport() {
        MouseEventList.forEach((ev) => {
            window.addEventListener(ev, (e) => {
                // 将其断言成元素 可操作
                const target = e.target as HTMLElement;
                const targetKey = target.getAttribute('target-key');
                if(targetKey) {
                    this.reportTracker({
                        event: ev,
                        targetKey
                    })
                }
            })
        })
    }
    
    // 自动上报
    private captureEvents <T>(mouseEventList: string[], targetKey: string, data?: T) {
        mouseEventList.forEach((event) => {
            window.addEventListener(event, ()=>{
                console.log('监听到了');
                this.reportTracker({
                    event,
                    targetKey,
                    data
                })
            })
        })

    }

    private installTracker() {
        if(this.data.historyTracker) {
            this.captureEvents(['pushState'], 'history-pv');
            this.captureEvents(['replaceState'], 'history-pv');
            this.captureEvents(['popstate'], 'history-pv');
        }
        if(this.data.hashTracker) {
            this.captureEvents(['hashChang'], 'hash-pv');
        }
        if(this.data.domTracker) {
            this.targetKeyReport();
        }
        if(this.data.jsError) {
            this.jsError();
        }
    }

    private jsError() {
        this.errorEvent();
        this.promiseReject();
    }

    private errorEvent() {
        window.addEventListener('error', (event) => {
            this.reportTracker({
                event: 'error',
                targetKey: 'message',
                message: event.message
            })
        })
    }

    private promiseReject() {
        window.addEventListener('unhandledrejection', (event) => {
            event.promise.catch(error=>{
                this.reportTracker({
                    event: 'promise',
                    targetKey: 'message',
                    message: error
                })
            })
        })
    }

    private reportTracker <T>(data: T) {
        // sendBeacon无法直接发送JSON格式的文件 这里转换一下参数
        const params = Object.assign(this.data, data, { time: new Date().getTime() });
        // 改请求头
        let headers = {
            type: 'application/x-www-form-urlencoded'
        }
        let blob = new Blob([JSON.stringify(params)], headers);
        navigator.sendBeacon(this.data.requestUrl, blob);
    }


}