import fetch from 'isomorphic-fetch';

// 配置对象
const config = {};

// 缓存配置
config.list = [{
  /**
   * 配置id
   */
  id: 'defaults',
  /**
   * http start
   */
  showLoading: () => console.log('showLoading'),
  /**
   * http end
   */
  hideLoading: () => console.log('hideLoading'),
  /**
   * @param data 接受的http的response和catch到的error
   * @param options http requset参数
   */
  errorHandler(data, options) {
    this.toast && this.toast();
    console.log('错误提示:', data);
    if (data && data.status === 403 && options.needLogin) {
      // TODO login
    }
  },
  /**
   * 弹出错误提示
   */
  toast: () => console.log('toast')
}];

// 现在的配置
config.currentConfig = config.list[0];

// 添加配置
config.add = (options) => {
  if (options.id) throw new Error('requset config need key: id!');
  options = Object.assign({}, config.defaults, options);
  config.list.push(options);
};

// 更换换配置
config.change = (id) => {
  config.list.some((item) => {
    if (item.id === id) {
      config.currentConfig = item;
      return true;
    }
    return false;
  });
};

/**
 * 自定义键值：
 * url 请求链接
 * loading 请求过程加loading动画
 * errorTips 自动处理错误
 * translateResponseBySelf 发送http请求，response自己处理
 * needLogin 是否需要登录
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
  ownVariable.loading && config.currentConfig.showLoading();
  console.log('http start with request ---->', ownVariable.url, options);

  const sentPromise = fetch(ownVariable.url, options);

  // 不处理response数据 并 不处理错误
  if (ownVariable.translateResponseBySelf) return sentPromise;

  // json()处理数据 并 加入通用错误处理 并 返回错误数据
  if (isWeb && ownVariable.errorTips) {
    const errorResult = { success: false };
    return sentPromise.then((res) => {
      // TODO http end
      console.log('http end with response ---->', res);
      ownVariable.loading && config.currentConfig.hideLoading();

      const result = res.json();
      if (res && res.ok) {
        return result;
      }

      // TODO http status wrong or run res.json wrong
      // 排除运行res.json时的报错
      const newPromiseForParse = new Promise((resolve, reject) => {
        result.then((data) => {
          config.currentConfig.errorHandler(data, _options);
          resolve(data);
        }, (error) => {
          // 运行res.json报错
          console.log('try json parse response error!!');
          reject(error);
        });
      });
      return newPromiseForParse;
    }).catch((e) => {
      // TODO network block or js error
      console.log('http end with error ----->', e);
      ownVariable.loading && config.currentConfig.hideLoading();

      config.currentConfig.errorHandler(e, _options);
      return errorResult;
    });
  }

  // json()处理数据 并 不处理错误
  return sentPromise.then((res) => {
    // TODO http end
    console.log('http end with response ---->', res);
    ownVariable.loading && config.currentConfig.hideLoading();

    return res.json();
  });
};

request.config = config;

export default request;
