import fetch from 'isomorphic-fetch';

const errorHandler = (res, options) => {
  console.log('错误提示:', res);

  if (res && res.status === 403 && options.needLogin) {
    // TODO login
    console.log('need login');
  }
};

/**
 * 自定义键值：
 * url 请求链接
 * loading 请求过程加loading动画
 * errorTips 自动处理错误
 * translateResponseBySelf 发送http请求，response自己处理
 * needLogin
 * @param options {json}
 * @returns {Promise}
 */
const request = (options) => {
  // 默认值
  const defaults = {
    method: 'POST',
    credentials: 'include'
  };
  const _options = options;

  const ownVariableRegExp = /loading|errorTips|url|translateResponseBySelf|needLogin/;
  const ownVariable = {};
  const isWeb = typeof window === 'object';

  // 设置 request headers
  if (typeof options.headers === 'object') {
    options.headers = Object.assign(defaults.headers, options.headers);
  }
  options = Object.assign({}, defaults, options);

  // 取出自定义值
  Object.keys(options).forEach((key) => {
    if (ownVariableRegExp.test(key)) {
      ownVariable[key] = options[key];
      delete options[key];
    }
  });

  if (!ownVariable.url) {
    return console.error('request 需要一个 url值');
  }

  // GET/HEAD 删除body
  if (/get|head/.test(options.method.toLowerCase())) {
    delete options.body;
  } else if (/post/.test(options.method.toLowerCase())) {
    if (isWeb && options.body instanceof FormData) {
      // FormData
    } else if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    } else {
      // String
    }
  }

  // TODO http start
  console.log('http start with request ---->', options);

  const sentPromise = fetch(ownVariable.url, options);

  // 不处理response数据 并 不处理错误
  if (ownVariable.translateResponseBySelf) return sentPromise;

  // json()处理数据 并 加入通用错误处理 并 返回错误数据
  if (isWeb && ownVariable.errorTips) {
    const errorResult = { success: false };
    return sentPromise.then((res) => {
      // TODO http end
      console.log('http end with response ---->', res);

      const result = res.json();
      if (res && res.ok) {
        return result;
      }

      // TODO http status wrong or run res.json wrong
      // 排除运行res.json时的报错
      const newPromiseForParse = new Promise((resolve, reject) => {
        result.then((data) => {
          errorHandler(data, _options);
          resolve(data);
        }, (error) => {
          // 运行res.json报错
          console.log('response json parse error!!');
          reject(error);
        });
      });
      return newPromiseForParse;
    }).catch((e) => {
      // TODO network block or js error
      console.log('http end with error ----->', e);

      errorHandler(e, _options);
      return errorResult;
    });
  }

  // json()处理数据 并 不处理错误
  return sentPromise.then((res) => {
    // TODO http end
    console.log('http end with response ---->', res);

    return res.json();
  });
};

export default request;
