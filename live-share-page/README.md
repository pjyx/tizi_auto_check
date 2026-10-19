# 直播分享 H5

直播分享落地页，风格参考点播分享页（`xjdxwy/share-page`）。

## 链接格式

```
https://xjdxwystatic.bestv.com.cn/xjdxwy/live-share-page/live-share-page.html?p=<base64(JSON)>
```

`p` 为 UTF-8 JSON 的 Base64 编码，字段：

| 字段 | 说明 |
| --- | --- |
| `channelCode` | 直播频道编码 |
| `name` | 直播中文名 |
| `name2` | 直播维语名 |
| `poster` | 海报完整 URL（App 侧已拼接图片服务器地址） |
| `endTime` | 截止时间戳（秒）。仅用于 App 拉起时校验，H5 不校验 |

## 拉起 App

- Android：`anar://live?channelCode=..&name=..&name2=..&poster=..&endTime=..`
- iOS：沿用点播策略，按钮跳转 App Store；Universal Link 由系统自动拉起 App。
- 微信/QQ 内置浏览器：提示用户用浏览器打开。

H5 不依赖第三方库，可直接部署为静态资源。
