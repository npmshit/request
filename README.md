# @blueshit/request

轻量级的http客户端，飞一般的感觉

## 安装

```bash
npm install @blueshit/request --save
```

## 使用方法

```typescript
import { request } from "@blueshit/request";

const res = await request({
  method: "POST",
  url: "http://exmple.com/xxx",
  qs: {},
  body: { arg1: "xxx" },
  json: true,
});
console.log("status=%s, body=%j", res.statusCode, res.body);
```

```typescript
export interface RequestOptions {
  /** 请求方法，默认 GET */
  method?: string;
  /** 请求地址 */
  url: string;
  /** QueryString 参数 */
  qs?: Record<string, any>;
  /** 请求体，仅支持 JSON 对象 */
  body?: any;
  /** 预期响应体为 JSON */
  json?: boolean;
  /** 预期响应体为 string */
  text?: boolean;
  /** 请求头 */
  headers?: http.OutgoingHttpHeaders;
}
```

## 性能测试

```
--------------------------------------------------------
@blueshit/request Benchmark
--------------------------------------------------------

Platform info:
- Darwin 18.6.0 x64
- Node.JS: 10.16.0
- V8: 6.8.275.32-node.52
  Intel(R) Core(TM) i5-3210M CPU @ 2.50GHz × 4


5 tests success:
┌────────────────────────┬────────┬───────────┬─────────┐
│ test                   │ rps    │ ns/op     │ spent   │
├────────────────────────┼────────┼───────────┼─────────┤
│ axios                  │ 2831.7 │ 353146.9  │ 60.178s │
├────────────────────────┼────────┼───────────┼─────────┤
│ axios #default agent   │ 435.5  │ 2296465.8 │ 78.298s │
├────────────────────────┼────────┼───────────┼─────────┤
│ request                │ 2030.1 │ 492593.0  │ 60.252s │
├────────────────────────┼────────┼───────────┼─────────┤
│ request #default agent │ 305.9  │ 3268722.0 │ 63.508s │
├────────────────────────┼────────┼───────────┼─────────┤
│ @blueshit/request      │ 5084.1 │ 196693.2  │ 60.254s │
└────────────────────────┴────────┴───────────┴─────────┘
{ blueshit: { success: 306335, fail: 0 },
  request: { success: 131387, fail: 10358 },
  axios: { success: 203786, fail: 714 } }
```

## License

```
MIT License

Copyright (c) 2019 npm @blueshit & @modernjs scope

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
