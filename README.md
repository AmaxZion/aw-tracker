# npm 埋点包 试点开发 aw-tracker

### 使用方法如下

##### 1.`` npm install aw-tracker --save-dev ``

##### 2.在文件中使用
``` 
import Tracker from  aw-tracker

const tr = new Tracker({
    requestUrl: 'xxxxxxx'
})

```

##### 3.option配置项

```
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
```