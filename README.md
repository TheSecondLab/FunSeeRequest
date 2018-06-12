# FunSee Request
该库是在[isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)上封装的一个request库。 提供如下功能。

## 使用
### 应用于nodeJs, 配合Koa使用。
```
const { requestMid } = require('funsee-request');
const Koa = require('koa');

const app = new Koa();
const serviceConfig = {
  default: 'http://localhost:8080',
  java: 'https://javaapi.xxx.com'
};

requestMid(app, serviceConfig);

app.use(async (ctx, next) => {
  try {
    const result = await ctx.ajax.post(.....);
  } catch(e) {
    // error handle
  }
})
```
通过`requestMid(app, serviceConfig);`,将request实例挂载至ctx.ajax上。 request实例将于下文详解。

### 应用于client端。
```
const { request } = require('funsee-request');
```
通过该代码在client端获得request对象。


## request实例对象
### request方法
```
request.request(path, option) => Promise
```

path< string >: 请求的path路径。    
option < object >: 请求的所有配置项，如下为option的具体说明
```
 /**
   *
   * service:string = 'default'
   * method: string = 'POST'
   * body: object
   * header: object = { 'Content-Type': 'application/json'}
   * 
   */
```
* service: 设置于配置文件中的serviceName. 如上文配置的'default'和'java'。默认值为'default'。
* method: 请求的方法， 如GET, POST。 默认为POST。
* body: 当method为post时， 传的是请求体。
* header: 请求头， 默认为 { 'Content-Type': 'application/json' }


### get方法
```
request.get(path) => Promise
```
request的简便版GET请求， 只接受path, 其他option均为默认值

### post方法
```
request.post(path, body) => Promise
```
request的简便版POST请求， 只接受path和请求体body, 其他option均为默认值
